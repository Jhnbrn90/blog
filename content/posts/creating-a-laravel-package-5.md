---
title: 'Creating a Laravel specific package'
date: '2019-09-17'
cover: 'cover.jpeg'
description: 'In this series of blog posts I try to provide a comprehensive guide toward creating Laravel packages from scratch. This series of posts will guide you through creating a Laravel specific package from scratch including use of facades, configuration, service providers, models, migrations, routes, controllers, views, assets, events and writing tests.'
---

## Middleware, events & listeners, mail, broadcasting

Update: see the [LaravelPackage.com](https://laravelpackage.com/) project for an up-to-date, comprehensive recollection of these posts.

*This post is part of a series:*

- [1\. Package basics: requirements, service providers, testing](/posts/creating-a-laravel-package-1)
- [2\. Facades, artisan commands, custom configuration](/posts/creating-a-laravel-package-2)
- [3\. Models, migrations, App\User relations](/posts/creating-a-laravel-package-3)
- [4\. Routes, controllers, views, assets](/posts/creating-a-laravel-package-4)
- **[5\. Middleware, events & listeners, mail, broadcasting](/posts/creating-a-laravel-package-5)**

## Introduction

In this last post in the series, I would like to cover emitting events, listening to events and handling notifications. [Dan Hanly](https://twitter.com/danhanly) pointed out to me that a package may also need to provide custom Middleware. I've updated this post to include a section on providing a global vs. route middleware with the package.

Let's first look at Events.

Events & Listeners
------------------

### What are events?

Laravel's events provide a way to hook in on a certain activity that took place in your application. They can be emitted/dispatched using the `event()` helper, which accepts an `Event` class as a parameter. After an event is dispatched, the `handle()` method of all registered Listeners will be triggered. The listeners for a certain event are defined in the application's **event service provider**. An event-driven approach might help to keep the code loosely coupled.

It is not uncommon that packages emit events upon performing a certain task. The end user may or may not register his own listeners for an event you submit within a package. However, sometimes you might also want to listen within your package to your own events. Then, we'll need **our own event service provider** and that's what we're looking at in the next section.

### Creating a new Event

First, let's dive in and emit an event whenever a new Post is created via the route we set up earlier. In a new `Events` folder in the `src/` directory, create a new PostWasCreated.php file. In the `PostWasCreated` event class we'll accept the Post that was created in the constructor and save it to a public instance variable `$post`.

```php
// 'src/Events/PostWasCreated.php'
<?php

namespace JohnDoe\BlogPackage\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use JohnDoe\BlogPackage\Models\Post;

class PostWasCreated {
    use Dispatchable, SerializesModels;

    public $post;

    public function __construct(Post $post) {
        $this->post = $post;
    }
}
```

When creating a new Post in the PostController, we can now emit this event (don't forget to import it):

```php
// 'src/Http/Controllers/PostController.php'
<?php

use JohnDoe\BlogPackage\Events\PostWasCreated;

class PostController extends Controller {
  public function store() {
    // authentication and validation checks...

    $post = $author->posts()->create([...]);

    event(new PostWasCreated($post));

    return redirect(...);﻿
  }
}
```

Testing that we're emitting the event

Of course, we want to be sure this event is successfully fired. Therefore, let's add a test to our `CreatePostTest` feature test. We can easily fake Laravel's `Event` facade and make assertions (check [Laravel documentation](https://laravel.com/docs/6.x/mocking#event-fake) on Fakes) that the event was emitted **and** about the passed `Post` model.

```php
// 'tests/Feature/CreatePostTest.php'
use Illuminate\Support\Facades\Event;
use JohnDoe\BlogPackage\Events\PostWasCreated;
use JohnDoe\BlogPackage\Models\Post;

class CreatePostTest extends TestCase {
  use RefreshDatabase;

  // other tests

  /** @test */
  function an_event_is_emitted_when_a_new_post_is_created() {
      Event::fake();

      $author = factory(User::class)->create();

      $this->actingAs($author)->post(route('posts.store'), [
        'title' => 'A valid title',
        'body' => 'A valid body',
      ]);

      $post = Post::first();

      Event::assertDispatched(PostWasCreated::class, function ($event) use ($post) {
          return $event->post->id === $post->id;
      });
  }
}
```

Now that we know that our event is fired correctly, let's hook up our own listener.

### Creating a new Listener

Now, after a `PostWasCreated` let's modify the title of our post, for demonstrative purposes. In the `src/` directory, create a new folder `Listeners`. In this folder, create a new file that describes our action: UpdatePostTitle.php:

```php
// 'src/Listeners/UpdatePostTitle.php'
<?php

namespace JohnDoe\BlogPackage\Listeners;

use JohnDoe\BlogPackage\Events\PostWasCreated;

class UpdatePostTitle {
    public function handle(PostWasCreated $event) {
        $event->post->update([
            'title' => 'New: ' . $event->post->title
        ]);
    }
}
```

### Testing the Listener

Now, some might say it is overdue since we will also test the Event->Listener cascade (later on in this section), I think it is worthwhile to have this test. If anything ever breaks, this test will lead you directly to the root of the problem: the listener. We test that the Listener's `handle()` method indeed changes the title of a blog post (in our silly example) by newing up the `UpdatePostTitle` Listener and passing a `PostWasCreated` event to its `handle()` method:

```php
// 'tests/Feature/CreatePostTest.php'
/** @test */
function a_newly_created_posts_title_will_be_changed() {
    $post = factory(Post::class)->create([
        'title' => 'Initial title',
    ]);

    $this->assertEquals('Initial title', $post->title);

    (new UpdatePostTitle())->handle(
        new PostWasCreated($post)
    );

    $this->assertEquals('New: ' . 'Initial title', $post->fresh()->title);
}
```

Now that we have a passing test for emitting the event, and we know that our listener shows the right behaviour handling the event, let's couple the two together and create a custom event service provider.

### Creating our own event service provider

Just like in Laravel, our package can have multiple service providers as long as we load them in our main application service provider (in the next section). First, create a new folder `Providers` in the `src/` directory. Add a file called EventServiceProvider.php and register our Event and Listener:

```php
// 'src/Providers/EventServiceProvider.php'
<?php

namespace JohnDoe\BlogPackage\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use JohnDoe\BlogPackage\Events\PostWasCreated;
use JohnDoe\BlogPackage\Listeners\UpdatePostTitle;

class EventServiceProvider extends ServiceProvider {

    protected $listen = [
        PostWasCreated::class => [
            UpdatePostTitle::class,
        ]
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot() {
        parent::boot();
    }
}
```

### Registering the event service provider

In the `BlogPackageServiceProvider` we need to register our Event Service Provider (don't forget to import) in the `register()` method, as follows:

```php
// 'BlogPackageServiceProvider.php'
use JohnDoe\BlogPackage\Providers\EventServiceProvider;

public function register() {
  // merge config files

  $this->app->register(EventServiceProvider::class);
}
```

### Testing the Event -> Listener cascade

Earlier we faked the Event facade, but in this test we would like to confirm that an event was fired that lead to a handle method on a listener and that eventually changed the title of our Post, exactly like we'd expect. This test is easy: just assume that the title was changed after creating a new post. We'll add this method to the `CreatePostTest` feature test:

```php
// 'tests/Feature/CreatePostTest.php'
/** @test */
function the_title_of_a_post_is_updated_whenever_a_post_is_created() {
    $author = factory(User::class)->create();

    $this->actingAs($author)->post(route('posts.store'), [
        'title' => 'A valid title',
        'body' => 'A valid body',
    ]);

    $post = Post::first();

   $this->assertEquals('New: ' . 'A valid title', $post->title);
}
```

This test is green, but what if we run the full suite?

### Fixing the failing test

If we run the full suite with `composer test`, we see we have one failing test:

```
There was 1 failure:

1) JohnDoe\BlogPackage\Tests\Feature\CreatePostTest::authenticated_users_can_create_a_post
Failed asserting that two strings are equal.
--- Expected
+++ Actual
@@ @@
-'My first fake title'
+'New: My first fake title'
```

This is a regression from the Event we've introduced. There are two ways to fix this error: 1) change the expected title in the `authenticated_users_can_create_a_post` test or 2) by faking any events before the test is run which inhibits the actual handlers to be called. It is very situational what happens to be the best option but let's go with option **2** for now.

```php
// 'tests/Feature/CreatePostTest.php'
/** @test */
function authenticated_users_can_create_a_post() {
    Event::fake();

    $this->assertCount(0, Post::all());
    // the rest of the test... 
```

All tests are green, so let's move on to the next topic.

## Mail, Jobs & Notifications

Now that we have Events and Listeners in place, sending mail(s) or notification(s) as well as dispatching Jobs would work as you'd expect and can ideally be send from the Listener's `handle()` method. First, you create a `Mail` / `Jobs` / `Notifications` folder in the `src/` directory. Add a mailable / job / notification class and call this class from your Listener's `handle()` method.

Refer to the Laravel documentation for more information: [Mail](https://laravel.com/docs/6.x/mail), [Jobs](https://laravel.com/docs/6.x/queues#dispatching-jobs), [Notifications](https://laravel.com/docs/6.x/notifications).

## Middleware

### What is middleware?

If we look at an incoming HTTP request, this request is processed by Laravel's index.php file and sent through a series of pipelines. These include a series of middleware ('before' middleware), which each will perform an action on the incoming request before it eventually reaches the core of the application. From the core, a response is prepared which is post modified by all registered 'after' middleware before returning the response.

That's why middleware is great for authentication, verifying tokens or applying any other check. Laravel also uses middleware to strip out empty characters from strings and encrypt cookies.

### Creating a middleware

Let's create our own middleware, which capitalizes a 'title' parameter whenever that is present in the request (this would be silly, just for demonstration). Create a new `Middleware` folder in the `src/Http/` directory. Add a file called CapitalizeTitle.php which provides a `handle()` method accepting the current request and a `$next` action:

```php
// 'src/Http/Middleware/CapitalizeTitle.php'
<?php

namespace JohnDoe\BlogPackage\Http\Middleware;

use Closure;

class CapitalizeTitle {
    public function handle($request, Closure $next) {
        if ($request->has('title')) {
            $request->merge([
                'title' => ucfirst($request->title)
            ]);
        }

        return $next($request);
    }
}
```

### Testing the middleware

Although we haven't registered the middleware yet, and it will not be used in the application we **do** want to make sure that the handle() method shows the correct behaviour. Let's add a new CapitalizeTitleMiddlewareTest.php unit test in the `tests/Unit` directory. In this test, we'll assert that a `title` parameter on a `Request()` will contain the capitalized string after the middleware ran its `handle()` method:

```php
// 'tests/Unit/CapitalizeMiddlewareTest.php'
<?php

namespace JohnDoe\BlogPackage\Tests\Unit;

use Illuminate\Http\Request;
use JohnDoe\BlogPackage\Http\Middleware\CapitalizeTitle;
use JohnDoe\BlogPackage\Tests\TestCase;

class CapitalizeTitleMiddlewareTest extends TestCase {
    /** @test */
    function it_capitalizes_the_request_title() {
        // Given we have a request
        $request = new Request();

        // with  a non-capitalized 'title' parameter
        $request->merge(['title' => 'some title']);

        // when we pass the request to this middleware,
        // it should've capitalized the title
        (new CapitalizeTitle())->handle($request, function ($request) {
            $this->assertEquals('Some title', $request->title);
        });
    }
}
```

Now that we know the `handle()` method does its job correctly, let's look at the two options to register the middleware:globally vs. route specific.

### Global middleware

Global middleware is as the name implies, *globally* applied. Each request will pass through these middlewares.

If we want our capitalization check example to be applied globally, we can append this middleware to the `Http\Kernel` from within our package's service provider. Make sure to import the Http Kernel contract, not the Console Kernel contract:

```php
// 'BlogPackageServiceProvider.php'
use Illuminate\Contracts\Http\Kernel;
use JohnDoe\BlogPackage\Http\Middleware\CapitalizeTitle;

public function boot() {
  // other things ...

  $kernel = $this->app->make(Kernel::class);
  $kernel->pushMiddleware(CapitalizeTitle::class);
}
```

This will push our middleware into the application's array of globally registered middleware.

### Route middleware

In our case, you might argue that we likely don't have a title paramter on each request. Probably even only on requests that are related to creating/updating posts. On top of that, we likely only ever want to apply this middleware to requests related to our blog posts. However, this middleware will modify **all requests** which have a title attribute. This is probably not desired. The solution is to make the middleware route specific.

Therefore, we can register an alias to this middleware in the resolved `Router` class, from within the `boot()` method of our service provider.

```php
// 'BlogPackageServiceProvider.php'
use Illuminate\Routing\Router;
use JohnDoe\BlogPackage\Http\Middleware\CapitalizeTitle;

public function boot() {
  // other things ...

  $router = $this->app->make(Router::class);
  $router->aliasMiddleware('capitalize', CapitalizeTitle::class);
}
```

We can apply this middleware from within our controller, for example by requiring it from the constructor:

```php
// 'src/Http/Controllers/PostController.php'
class PostController extends Controller {
    public function __construct() {
        $this->middleware('capitalize');
    }

    // other methods... (will use this middleware)
}
```

### Testing that the middleware is applied

Now, regardless of your choice to register the middleware globally or route specifically, we need to test the middleware is indeed applied when making a request. Add a new test to the `CreatePostTest` feature test, in which we'll assume our non-capitalized title will be capitalized after the request has been made.

```php
// 'tests/Feature/CreatePostTest.php'
/** @test */
function creating_a_post_will_capitalize_the_title() {
    $author = factory(User::class)->create();

    $this->actingAs($author)->post(route('posts.store'), [
        'title' => 'some title that was not capitalized',
        'body' => 'A valid body',
    ]);

    $post = Post::first();

    // 'New: ' was added by our even listener
    $this->assertEquals('New: Some title that was not capitalized', $post->title);
}
```

## Final Notes

In this post I tried to explain how to create a Laravel **specific** package from scratch. Although we covered a lot, some important topics are left untouched.

If you want to learn more about adding a **Readme, **choosing a **License**, **version** your package, how to add your package to **Packagist **and more, I highly recommend checking out [this video course](https://phppackagedevelopment.com/) by Marcel Pociot.

In addition to his course, Marcel also made a [Laravel Package Boilerplate](https://laravelpackageboilerplate.com/#/) generator, which can help you getting started developing a package by providing a basic template. Make sure to check it out!

Please also checkout [LaravelPackage.com](https://laravelpackage.com) which contains more up-to-date information regarding creating a Laravel package from scratch.