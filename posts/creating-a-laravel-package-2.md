---
title: 'Creating a Laravel specific package'
date: '2019-09-17'
cover: 'cover.jpeg'
description: 'In this series of blog posts I try to provide a comprehensive guide toward creating Laravel packages from scratch. This series of posts will guide you through creating a Laravel specific package from scratch including use of facades, configuration, service providers, models, migrations, routes, controllers, views, assets, events and writing tests.'
---

## Facades, artisan commands, custom configuration

Update: see the [LaravelPackage.com](https://laravelpackage.com/) project for an up-to-date, comprehensive recollection of these posts.

*This post is part of a series:*

- [1\. Package basics: requirements, service providers, testing](/posts/creating-a-laravel-package-1)
- **[2\. Facades, artisan commands, custom configuration](/posts/creating-a-laravel-package-2)**
- [3\. Models, migrations, App\User relations](/posts/creating-a-laravel-package-3)
- [4\. Routes, controllers, views, assets](/posts/creating-a-laravel-package-4)
- [5\. Middleware, events & listeners, mail, broadcasting](/posts/creating-a-laravel-package-5)


## Introduction

Now that we have a service provider for our package, we can register something in it. Let's start by using Facades, which can provide an easy and memorable syntax to interact with our package.

Later on, we'll discuss how to add a **custom configuration** and provide our own **artisan commands** in this post.

## Facades

Let's assume that we provide a `Calculator` class as part of our package and want to make this class available as a facade ([learn more about facades](https://laravel.com/docs/6.x/facades)).

Let's create a Calculator.php file in the `src/` directory. To keep things simple, we only provide an `add()`, `subtract()`and `clear()` method, but you can imagine having methods for multiplication, division, etc. All methods return the object itself allowing for a fluent API (allowing the chaining of method calls, like: `->add()->subtract()->subtract()->result()`).

```php
// 'src/Calculator.php'
<?php

namespace JohnDoe\BlogPackage;

class Calculator {
    private $result;

    public function __construct() {
        $this->result = 0;
    }

    public function add(int $value) {
        $this->result += $value;

        return $this;
    }

    public function subtract(int $value) {
        $this->result -= $value;

        return $this;
    }

    public function clear() {
      $this->result = 0;

      return $this;
    }

    public function getResult() {
        return $this->result;
    }
}
```

In addition to this class, we'll create the facade in a new `src/Facades` folder:

```php
// 'src/Facades/Calculator.php'
<?php

namespace JohnDoe\BlogPackage\Facades;

use Illuminate\Support\Facades\Facade;

class Calculator extends Facade {
    protected static function getFacadeAccessor() {
        return 'calculator';
    }
}
```

Finally, we register the binding in the service container in our service provider:

```php
// BlogPackageServiceProvider.php
namespace JohnDoe\BlogPackage;

public function register() {
  $this->app->bind('calculator', function($app) {
      return new Calculator();
  });
}
```

The `Calculator` facade can now be used by the end user after importing it from the appropriate namespace: `use JohnDoe\BlogPackage\Facades\Calculator;`. However, Laravel allows us to register an alias which can register a facade in the root namespace. We can define our alias under an "alias" key below the "providers" in the composer.json file:

```json
"extra": {
    "laravel": {
        "providers": [
            "JohnDoe\\BlogPackage\\BlogServiceProvider"
        ],
        "aliases": {
            "Calculator": "JohnDoe\\BlogPackage\\Facades\\Calculator"
        }
    }
}
```

Our facade now no longer requires an import and can be used in projects from the root namespace.

## Custom configuration

It is quite likely that your package allows configuration by the end user.

If you want to offer custom configuration options, create a new `config` directory in the root of the package and add a file called config.php, which returns an array of options.

```php
// 'config/config.php'
<?php

return [
  'posts_table' => 'posts',
  // other options...
];
```

After registering the config file in the `register()` method of our service provider under a certain "key" ('blogpackage' in our demo), we can access the config values from the config helper by prefixing our "key" as follows: `config('blogpackage.posts_table')`.

```php
// 'BlogPackageServiceProvider.php'
public function register() {﻿
  $this->mergeConfigFrom(__DIR__.'/../config/config.php', 'blogpackage');
}
```

Now, to let our users modify the default values, we need to provide them with the option to export the config file. We can register all "publishables" within the `boot()` method of the package's service provider. Since we only want to offer this functionality whenever the package is booted from the console, we'll add a check if the current app is running in the console. If so, we'll register the publishable config file under the 'config' tag (2nd parameter of the `$this->publishes()` function call).

```php
// 'BlogPackageServiceProvider.php'﻿
public function boot() {﻿
  if ($this->app->runningInConsole()) {

    $this->publishes([
      __DIR__.'/../config/config.php' =>   config_path('blogpackage.php'),
    ], 'config');

  }
}
```

The config file can now be exported using the command listed below, creating a blogpackage.php file in the `config` directory of the Laravel project in which the package was required.

php artisan vendor:publish --provider="JohnDoe\BlogPackage\BlogPackageServiceProvider" --tag="config"

## Artisan commands

### Laravel's CLI

Laravel ships with a PHP executable 'artisan' file, providing a command-line interface (CLI) for the framework. Via this CLI, you can access commands as `php artisan migrate` and `php artisan make:model Post`.

Let's say that we want to provide an easy artisan command for our end user to publish the config file, via: `php artisan blogpackage:install`. However, there are a lot of things you could do. Make sure to read up on the artisan console in the [Laravel documentation](https://laravel.com/docs/6.x/artisan).

### Creating a new command

Create a new `Console` folder in the `src/` directory and create a new file named InstallBlogPackage.php. This class will extend Laravel's `Command` class and provide a `$signature` (the command) and a `$description` property. In the `handle()` method we specify what our command will do. In this case, we provide some feedback that we're "installing" the package and we'll call another artisan command to publish the config file. Finally, we let the user know that we're done.

```php
// 'src/Console/InstallBlogPackage.php'
<?php

namespace JohnDoe\BlogPackage\Console;

use Illuminate\Console\Command;

class InstallBlogPackage extends Command {
    protected $signature = 'blogpackage:install';

    protected $description = 'Install the BlogPackage';

    public function handle() {
        $this->info('Installing BlogPackage...');

        $this->info('Publishing configuration...');

        $this->call('vendor:publish', [
            '--provider' => "JohnDoe\BlogPackage\BlogPackageServiceProvider",
            '--tag' => "config"
        ]);

        $this->info('Installed BlogPackage');
    }
}
```

### Registering the command in the service provider

We need to present this package functionality to the end user, thus registering it in the package's service container. Again, we only want to provide this functionality from the command-line so we'll add the publish() method within the if-statement (don't forget to import the class):

```php
// 'BlogPackageServiceProvider.php'
use JohnDoe\BlogPackage\Console\InstallBlogPackage;

public function boot() {
  if ($this->app->runningInConsole()) {
    // publish config file

    $this->commands([
        InstallBlogPackage::class,
    ]);
  }
}
```

### Testing the artisan command

To test that our command works, let's create a new unit test called InstallBlogPackageTest.php in the unit test folder.

Since we're using **Orchestra Testbench**, we have a config folder at `config_path()` containing every file a normal Laravel installation would have. (You can check where this directory lives yourself if you `dd(config_path())`). Therefore, we can easily assert that this directory should have our blogpackage.php config file after running our artisan command. To make sure we're starting at a clean state, let's delete any remainder config_file from the previous test first.

```php
// 'tests/Unit/InstallBlogPackageTest.php'
<?php

namespace JohnDoe\BlogPackage\Tests\Unit;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use JohnDoe\BlogPackage\Tests\TestCase;

class InstallBlogPackageTest extends TestCase {
    /** @test */
    function the_install_command_copies_a_the_configuration() {
        // make sure we're starting from a clean state
        if (File::exists(config_path('blogpackage.php'))) {
            unlink(config_path('blogpackage.php'));
        }

        $this->assertFalse(File::exists(config_path('blogpackage.php')));

        Artisan::call('blogpackage:install');

        $this->assertTrue(File::exists(config_path('blogpackage.php')));
    }
}
```

---

## Next post

In the next blog post we'll look at Models & Migrations, how to test them and what to do if you want to create a Model with a relation to the `App\User` model that ships with Laravel. [Continue to part 3](/posts/creating-a-laravel-package-3).