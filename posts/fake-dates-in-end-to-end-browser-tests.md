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
First, I created a new middleware called `SetTestDate` and registered this middleware in the 'web' middleware group.

```php
// 'app/Http/Kernel.php'

protected $middlewareGroups = [
    'web' => [
        // all other middelware...
        \App\Http\Middleware\SetTestDate::class,
    ],
```

In the `handle()` method of this middleware, make sure to only listen when the environment is either "local" (the default dev environment) or "testing" (the environment in `.env.cypress`).

```php
public function handle($request, Closure $next)
{
    if (App::environment(['local', 'testing'])) {
        // 
    }

    return $next($request);
}
```

Furthermore, we want to listen for a given request variable ("set_test_date" in this example) containing the specified (fake) date and persist this value in the session. For clarity and consistency let's store this variable in a class constant `REQUEST_VARIABLE`. 

Lastly, when we do already have this value in the session, make sure to apply the `Carbon::setTestNow()` method for this specific date.

An example of how the middleware eventually may look like is show below.

```php
// 'app/Http/Middleware/SetTestDate.php'

<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Illuminate\Support\Facades\App;

class SetTestDate
{
    const REQUEST_VARIABLE = 'set_test_date';

    public function handle($request, Closure $next)
    {
        if (App::environment(['local', 'testing'])) {
            if ($this->wantsToSetTestDate($request)) {
                $this->writeDateToSession($request);
            }

            if ($request->session()->has(self::REQUEST_VARIABLE)) {
                $this->setDateNow($request->session()->get(self::REQUEST_VARIABLE));
            }
        }

        return $next($request);
    }

    private function setDateNow($date)
    {
        Carbon::setTestNow(Carbon::parse($date));
    }

    private function wantsToSetTestDate($request)
    {
        return $request->has(self::REQUEST_VARIABLE);
    }

    private function writeDateToSession($request)
    {
        $request->session()->put(self::REQUEST_VARIABLE, $request->{self::REQUEST_VARIABLE});
    }
}
```


### Setting a custom (fake) date in the Cypress test
Now that we have our middleware in place, we can use the request variable we defined in our middleware to visit a route which uses the fake date. 

```js
it('shows the current date', () => {
    const date = 'tuesday 1 september 2020'

    cy.visit("/" + "?set_test_date=" + date);

    cy.contains('Tuesday, September 1st 2020')
})
```

## Conclusion
It is possible to manipulate the current date in Laravel *end-to-end* tests using a middleware that accepts a *fake date* as request parameter and sets a **session variable** to persist the fake date by calling `Carbon::setTestNow()` for subsequent requests.

When using Cypress in a Laravel application, make sure to checkout out the [laracasts/cypress](https://github.com/laracasts/cypress) helper package.

To learn more about Cypress in the context of Laravel applications, I can highly recommend [this video series](https://laracasts.com/series/cypress-and-laravel-integration) on Laracasts.

---

Photo by [Aron Visuals](https://unsplash.com/@aronvisuals?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/date-time?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)