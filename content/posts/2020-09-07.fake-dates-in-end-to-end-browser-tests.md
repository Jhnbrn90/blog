---
title: 'How to use fake dates in Cypress end-to-end testing'
date: '2020-09-07'
cover: 'cover.jpeg'
description: 'When writing an end-to-end test (or so called browser test), it might be tricky to force the application to use a certain (fake) date. In this post, I share my approach using a custom middleware to be able to write Cypress tests while your application is in a specific (fake) date.'
---

## Introduction
Recently, I wanted to write a [Cypress](https://cypress.io) acceptance ("end-to-end") test for a Laravel project where I wanted `Carbon::now()` to return a specific (fake) date, so I could act as if it were that specific date in my browser test.

Initially, I thought I could just set `Carbon::setTestNow()`, however this would only survive a single request and I wanted the custom date I specified to be applied globally in the application to make assertions about several endpoints within these tests.

After a few online searches, I decided to ask for help [on Twitter](https://twitter.com/JhnBrn90/status/1302680650860855297) and got a reply from [@sasin91](https://twitter.com/sasin91) which sparked a new idea: perhaps I could use a middleware 💡.

Eventually, I ended up using the following setup.

## The middleware approach
### Adding a new middleware
First, I created a new middleware called `SetTestDate`. We want to apply this middleware within the 'web' middleware group, but only when the environment is either "local" (the default dev environment) or "testing" (the environment in `.env.cypress`). 

Let's first conditionally push our middleware to the 'web' group within the `boot()` method of the `AppServiceProvider` as shown below.

```php
// app/Providers/AppServiceProvider.php

use App\Http\Middleware\SetTestDate;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot()
    {
        if ($this->app->environment(['local', 'testing'])) {
            $kernel = $this->app->make(Kernel::class);
            $kernel->appendMiddlewareToGroup('web', SetTestDate::class);
        }
    }
}
```

Within the `SetTestDate` middleware, we want to check if a certain cookie ("set_test_date" in this example) is set containing the specified (fake) date. For clarity and consistency let's store the name of this cookie in a class constant `TEST_DATE_COOKIE`. 

```php
// app/Http/Middleware/SetTestDate.php

<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;

class SetTestDate
{
    const TEST_DATE_COOKIE = 'set_test_date';

    public function handle($request, Closure $next)
    {
        if ($this->wantsToSetTestDate($request)) {
            $this->setDateNow($request->cookie(self::TEST_DATE_COOKIE));
        }

        return $next($request);
    }

    private function setDateNow($date)
    {
        Carbon::setTestNow(Carbon::parse($date));
    }

    private function wantsToSetTestDate($request)
    {
        return $request->cookie(self::TEST_DATE_COOKIE) !== null;
    }
}
```

### Setting a custom (fake) date in the Cypress test
Now that we have our middleware in place, we can use the request variable we defined in our middleware to visit a route which uses the fake date. 

```js
it('shows the current date', () => {
    const date = 'tuesday 1 september 2020'
    cy.setCookie('set_test_date', date);

    cy.visit("/");

    cy.contains('Tuesday, September 1st 2020')
})
```

### Encrypted cookies
If you'd run the test at this stage, no cookie will be resolved from the request and `null` will be returned for `$request->cookie('set_test_date')`.

Since Laravel encrypts the cookies by default due to the `EncryptCookies` middleware, we need to create an exception for the `set_test_date` cookie. 

```php
// app/Http/Middleware/EncryptCookies.php
class EncryptCookies extends Middleware
{
    protected $except = [
        'set_test_date'
    ];
}
```  

## Conclusion
It is possible to manipulate the current date in Laravel *end-to-end* tests using a middleware that accepts a *fake date* within a certain cookie and calling `Carbon::setTestNow()` for each request that has this cookie.

When using Cypress in a Laravel application, make sure to checkout out the [laracasts/cypress](https://github.com/laracasts/cypress) helper package.

To learn more about Cypress in the context of Laravel applications, I can highly recommend [this video series](https://laracasts.com/series/cypress-and-laravel-integration) on Laracasts.

---

Photo by [Aron Visuals](https://unsplash.com/@aronvisuals?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/date-time?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)