---
title: 'Creating a Laravel specific package'
date: '2019-09-17'
cover: 'cover.jpeg'
description: 'In this series of blog posts I try to provide a comprehensive guide toward creating Laravel packages from scratch. This series of posts will guide you through creating a Laravel specific package from scratch including use of facades, configuration, service providers, models, migrations, routes, controllers, views, assets, events and writing tests.'
---

## Package basics: requirements, service providers, testing

Update: see the [LaravelPackage.com](https://laravelpackage.com/) project for an up-to-date, comprehensive recollection of these posts.

*This post is part of a series:*

- **[1\. Package basics: requirements, service providers, testing](/posts/creating-a-laravel-package-1)**
- [2\. Facades, artisan commands, custom configuration](/posts/creating-a-laravel-package-2)
- [3\. Models, migrations, App\User relations](/posts/creating-a-laravel-package-3)
- [4\. Routes, controllers, views, assets](/posts/creating-a-laravel-package-4)
- [5\. Middleware, events & listeners, mail, broadcasting](/posts/creating-a-laravel-package-5)


## Introduction

In my experience, learning to develop a package for Laravel can be quite challenging. In this series of posts I try to provide a comprehensive guide to **develop a Laravel specific package from scratch**.

First of all, I want to thank Marcel Pociot. His very clear, structured and detailed [PHP Package Development](https://phppackagedevelopment.com/) video course helped me quickly getting started on developing my own packages. I can highly recommend his video course if you want to learn how to create (framework agnostic) PHP packages. In addition to his video course, Marcel also offers this [Laravel Package Boilerplate generator](https://laravelpackageboilerplate.com/#/) which helps you along with a basic template for your package.

While Marcel's lessons focus on creating a package from scratch, in this series of five posts I would like to focus on how different parts of a Laravel application could be translated to be used in a package.

## Package basics

### Reasons to develop a package

You might encounter a scenario where you want to reuse some feature(s) of your application in other applications, open source a certain functionality or just keep related code together but separate it from your main application. In those cases, it makes sense to extract parts to a package.

At the time of writing, there are nearly 240 000 packages available on [Packagist](https://packagist.org/), the main repository for PHP packages.

### How packages work

Packages or "libraries" provide an easy way to add additional functionality to existing applications, and are mostly focused on a single feature.

Packages are downloaded and installed using **Composer** - PHP's package management system - which manages dependencies within a project.

To install a package in your existing Laravel project, the `composer require <vendor>/<package>` command will download all necessary files into the `/vendor` directory of your project where all your third party packages live, separated by vendor name. As a consequence, the content from these packages is separated from your application code which means this piece of code is maintained by someone else, most often by creator of that package. Whenever the package needs an update, run `composer update` to get the latest (compatible) version of your packages.

### The concept of autoloading

After each installation or update, composer will generate an autoload.php file in the `/vendor` directory. By including this single file, you'll be able to access all classes provided by your installed libraries.

Looking at a Laravel project, you'll see that the index.php file in the application root (which handles all incoming requests) requires the autoloader, which then makes all required libraries usable within the scope of your application. This includes Laravel's first party `Illuminate` components as well as any required third party packages.

Laravel's index.php file:

```php
<?php

define('LARAVEL_START', microtime(true));

require __DIR__.'/../vendor/autoload.php';

// further bootstrapping methods...
```

### The directory structure of a package

In general (and by convention), a package contains a `src/` (short for "source") folder containing all package specific logic (classes) and a composer.json file containing information about the package itself. Additionally, most packages also include a license and documentation.

If we take a look at the general directory structure of a generic package, you'll notice how it looks quite different from a standard Laravel project.

```
- src
- tests
CHANGELOG.md
README.md
LICENSE
composer.json
```

In a package, all code that would live in the `app/` directory of a Laravel app, will live in the `src/` instead.

## Package prerequisites

In this section, I want to explain a basic workflow to get started working on a package, specific for Laravel. If you are interested in developing a framework agnostic package, I highly recommend the **video course** by Marcel as mentioned earlier.

### Installing Composer

If you haven't got Composer installed already, the quickest way to get composer up and running is by copying the script provided on the [download page of Composer](https://getcomposer.org/download/).

### Creating a directory for the package

Create an empty directory for your package. My only advice would be to keep your packages separate from your (Laravel) projects to be able to easily differentiate between them.

Personally, my packages are stored in `~/packages/` and my Laravel apps live in `~/websites/`.

### Creating a basic composer.json file

In the root of your package, first create a composer.json file with the following minimal configuration (as shown below). Of course, replace all details with your own.

It is important that you are consistent with naming your packages. The common convention is to use your GitHub / Gitlab / Bitbucket / etc. username followed by a forward slash ("/") and then a kebab cased version of your package name.

Composer.json:
```json
{
  "name": "johndoe/blogpackage",
  "description": "A demo package",
  "type": "library",
  "license": "MIT",
  "authors": [
    {
      "name": "John Doe",
      "email": "john@doe.com"
    }
  ],
  "require": {}
}
```

Alternatively, you can create your composer.json file by running `composer init`.

If you're planning to publish the package, it is important to choose an appropriate package type (in our case a "library") and license (e.g. "MIT"). Learn more about open source licenses at [ChooseALicense.com](https://choosealicense.com/).

### Namespacing the package

If we want to use the `src/` directory to store our code, we need to tell composer to map the package's namespace to that specific directory when creating the autoloader (vendor/autoload.php).

We can register our namespace under the "psr-4" autoload key in the composer.json file as follows (replace the namespace with your own):

```json
{
  ...,

  "require": {},

  "autoload": {
    "psr-4": {
      "JohnDoe\\BlogPackage\\": "src",
    }
  }
}
```

### What is PSR-4?

Now, you might wonder why we needed a "psr-4" key. PSR stands for *PHP Standards Recommendations* devised by the [*PHP Framework Interoperability Group*](https://www.php-fig.org/)(PHP-FIG). This group of 20 members, representing a cross-section of the PHP community, proposed [a series of PSR's](https://www.php-fig.org/psr/).

In the list, PSR-4 represents a recommendation regarding autoloading classes from filepaths, replacing the until then prevailing [PSR-0](https://www.php-fig.org/psr/psr-0/) autoloading standard.

The major difference between PSR-0 and PSR-4 being that PSR-4 allows to map a base directory to a certain namespace and therefore allowing shorter namespaces. I think [this comment](https://stackoverflow.com/a/50226226) on StackOverflow has a clear description of how PSR-0 and PSR-4 work:

PSR-0:

```json
"autoload": {
    "psr-0": {
        "Book\\": "src/",
        "Vehicle\\": "src/"
    }
}
```

-   Looking for `Book\History\UnitedStates` in `src/Book/History/UnitedStates.php`
-   Looking for `Vehicle\Air\Wings\Airplane` in `src/Vehicle/Air/Wings/Airplane.php`

PSR-4:

```json
"autoload": {
    "psr-4": {
        "Book\\": "src/",
        "Vehicle\\": "src/"
    }
}
```

-   Looking for `Book\History\UnitedStates` in `src/History/UnitedStates.php`
-   Looking for `Vehicle\Air\Wings\Airplane` in `src/Air/Wings/Airplane.php`

### Import the package in a local Laravel project

To help with development, you can require a local package in a local Laravel project.

If you have a local Laravel project, you can require your package locally, by defining a custom so called "repository" in the composer.json file ***of your Laravel application***.

Add the following "repositories" key below the "scripts" section in composer.json file of your Laravel app (replace the "url" with the directory where your package lives):

```json
{
  "scripts": { ... },

  "repositories": [
    {
      "type": "path",
      "url": "../../packages/blogpackage"
    }
  ]
}
```

You can now require your local package in the Laravel application using your choosen namespace of the package. Following our example, this would be:

```bash
composer require johndoe/blogpackage
```

Important: you will need to perform a `composer update` in your Laravel application whenever you make changes to the composer.json file of your package or any providers it registers.

### Installing Orchestra Testbench

We now have a composer.json file and an empty `src/` directory. However, we don't have access to any Laravel specific functionality as provided by the `Illuminate` components.

To use these components in our package, we'll require the [Orchestra Testbench](https://github.com/orchestral/testbench). Note that each version of the Laravel framework has a corresponding version of Orchestra Testbench. In this post, I'll assume we're developing a package for Laravel 6.0 which is the latest version at the moment of writing this post.

```bash
composer require --dev "orchestra/testbench=^4.0"
```

### Orchestra Testbench comes with Laravel

Now that we've installed the Orchestra Testbench package, we'll find an `orchestra` folder in the `vendor` directory of our package. In that folder, you'll see there is a `laravel` folder containing the `Illuminate` helpers and a `testbench-core` folder and in that folder you'll see there is a a folder called `laravel` with a complete directory structure of a Laravel project. This allows us to use the Laravel helpers that involve interaction with the project's directory structure (for example related to file manipulation).

Before each test, a testing environment including a fully booted (test) application is created. If we use the Orchestra TestBench's basic `TestCase` for our tests, the methods as provided by the `CreatesApplication` trait in the `Orchestra\Testbench\Concerns` namespace will be responsible for creating this test application. If we look at one of these methods, `getBasePath()` we'll see it directly points to the `laravel` folder that comes with Orchestra Testbench.

```php
// 'vendor/orchestra/testbench-core/src/Concerns/CreatesApplication.php'

/**
 * Get base path.
 *
 * @return string
 */
protected function getBasePath() {
    return __DIR__.'/../../laravel';
}
```

## Service Providers

### What is a service provider?

One of the most important parts of our package is the **Service Provider**. Before creating our own, I'll try to explain what service providers are about in this section first. If you are familiar with the service providers, please continue to the next section.

As you might know, Laravel comes with a series of service providers, namely the **AppServiceProvider**, **AuthServiceProvider**, **BroadcastServiceProvider**, **EventServiceProvider** and **RouteServiceProvider**. These providers take care of "bootstrapping" (or "registering") application specific services (as service container bindings), event listeners, middleware and routes. 

Every service provider extends the `Illuminate\Support\ServiceProvider` and implements a `register()` and a `boot()` method.

The `register()` method is used to bind things in the service container. After all other service providers have been registered (i.e. all `register()` methods of all service providers were called, including third party packages), Laravel will call the `boot()` method on all service providers.

In the `register()` method, you might for example register a class binding in the service container, enabling a class to be resolved from the container. However, sometimes you will need to reference another class, then the  `boot()` can be used.

Here are is an example of how a service provider may look and which things you might register in a `register()` and `boot()` method.

```php
use App\Calculator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {
  public function register() {
    // Register a class in the service container
    $this->app->bind('calculator', function ($app) {
      return new Calculator();
    });
  }

  public function boot() {
    // Register a macro, extending the Illuminate\Collection class
    Collection::macro('rejectEmptyFields', function () {
      return $this->reject(function ($entry) {
        return $entry === null;
       });
    });

    // Register an authorization policy
    Gate::define('delete-post', function ($user, $post) {
      return $user->is($post->author);
    });
  }
}
```

### Adding a service provider for our package

For our package, we will create our own service provider which contains specific information about the core of what our package has to offer. The package might use a config file, maybe some views, routes, controllers, database migrations, model factories, etc. The service provider needs to register them.

Since we've pulled in Orchestra Testbench, we can extend the `Illuminate\Support\ServiceProvider` and create our own service provider in the `src/` directory as shown (replace naming with your own details):

```php
// 'src/BlogPackageServiceProvider.php'
<?php

namespace JohnDoe\BlogPackage;

use Illuminate\Support\ServiceProvider;

class BlogServiceProvider extends ServiceProvider {
  public function register() {
    //
  }

  public function boot() {
    //
  }
}
```

### Autoloading the service provider

To automatically register it with a Laravel project using Laravel's package auto-discovery we add the "extra" > "laravel" > "providers" key to our service provider to our composer.json:

```json
{
  ...,

  "autoload": { ... },

  "extra": {
      "laravel": {
          "providers": [
              "JohnDoe\\BlogPackage\\BlogPackageServiceProvider"
          ],
      }
  }
}
```

Now, whenever someone includes our package, the service provider will be loaded and everything we've registered will be available in the application. Now let's see what we might want to register in this service provider.

## Testing a package

To develop a robust package, it is important to have test coverage for the provided code. Not only to confirm proper behavior of the existing code, but also to verify everything still works whenever new functionality is added. Therefore, I will dedicate a few sections in each post about testability and in this first one I'd like to explain the basics. Of course, you can just skip ahead if you already got this covered.

### Setting up PHPUnit

First we need to install PHPUnit as a dev-dependency in our package:

```bash
composer require --dev phpunit/phpunit
```

Note: you might need to install a specific version if you're developing a package for an older version of Laravel.

To configure PHPUnit, create a phpunit.xml file in the root directory of the package. Then, copy the following template to use an in-memory **sqlite** database and enable colorful reporting.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit bootstrap="vendor/autoload.php"
         backupGlobals="false"
         backupStaticAttributes="false"
         colors="true"
         verbose="true"
         convertErrorsToExceptions="true"
         convertNoticesToExceptions="true"
         convertWarningsToExceptions="true"
         processIsolation="false"
         stopOnFailure="false">
    <testsuites>
        <testsuite name="Test Suite">
            <directory>tests</directory>
        </testsuite>
    </testsuites>
    <filter>
        <whitelist>
            <directory suffix=".php">src/</directory>
        </whitelist>
    </filter>
    <php>
        <env name="DB_CONNECTION" value="testing"/>
    </php>
</phpunit>
```

### Creating a tests directory

Create a `tests/` directory with a `Unit` and `Feature` subfolder. Those will hold our unit and feature tests respectively.

### Creating a base TestCase

In the `tests/` directory we need to create a base TestCase.php where we can define tasks related to setting up our "world" before each test is executed. 

In our `TestCase` class we will implement three important set-up methods: `getPackageProviders()`, `getEnvironmentSetUp()` and `setUp()`. Let's look at these methods one by one.

**setUp():**

You might have already used this method in your own tests. Often it is used when you need a certain model in all following tests. The instantiation of that model can therefore be extracted to a `setUp()` method which is called before each test. Within the tests, the desired model can be retrieved from the Test class instance variable. When using this method, don't forget to call the parent `setUp()` method (and make sure to return `void`).

**getEnvironmentSetUp():**

As suggested by Orchestra Testbench: "*If you need to add something early in the application bootstrapping process, you could use the* `*getEnvironmentSetUp()*` *method*". Therefore, I suggest it is called before the `setUp()` method(s).

**getPackageProviders():**

As the name suggest, we can load our service provider(s) within the `getPackageProviders()` method. We'll do that by returning an array containing all providers. For now, we'll just include the package specific package provider, but imagine that if the package uses an EventServiceProvider, we would also register it here.

Our `TestCase` will inherit from the Orchestra Testbench TestCase:

```php
// 'tests/TestCase.php'
<?php

namespace JohnDoe\BlogPackage\Tests;

use JohnDoe\BlogPackage\BlogPackageServiceProvider;

class TestCase extends \Orchestra\Testbench\TestCase {
  public function setUp(): void {
    parent::setUp();
    // additional setup
  }

  protected function getPackageProviders($app) {
    return [
      BlogPackageServiceProvider::class,
    ];
  }

  protected function getEnvironmentSetUp($app) {
    // perform environment setup
  }
}
```

Before we can run our PHPUnit test suite, we first need to map our testing namespace to the appropriate folder in the composer.json file under an "autoload-dev" (psr-4) key:

```json
{
  ...,

  "autoload": {},

  "autoload-dev": {
      "psr-4": {
          "JohnDoe\\BlogPackage\\Tests\\": "tests"
      }
  }
}
```

Now, we must re-render the autoload file by running `composer dump-autoload`.

---

## Next post

In the next post we'll take a look at facades, how to add custom configuration and providing our own artisan command. [Continue to part 2](/posts/creating-a-laravel-package-2).

