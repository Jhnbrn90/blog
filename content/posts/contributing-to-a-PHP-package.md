---
title: 'Contributing to an open source PHP package'
date: '2020-09-17'
cover: 'cover.png'
description: 'Contributing to packages instead of applications can look challenging. In this blog post I want to show a workflow to work on PHP packages and be able to test them out locally.'
---

## Introduction
In view of upcoming Hacktoberfest, I was watching the interviews on the website of [CONTRIBUTING.MD](https://www.contributing.today/). The interview by [Freek van der Herten](https://freek.dev) learned that Spatie has numerous opportunities and welcomes first time contributors for upcoming Hacktoberfest.
 
 I want to share some tips for beginners who might want to make their first contribution to a PHP package - for example a package from Spatie. From my own experience, I know it can look daunting to work on a package as opposed to a "regular" (Laravel) application. 

This post is for all first-time PHP package contributors who are looking for a solid workflow to contribute to open source packages.

## Workflow
I would like to explain a basic workflow for contributing to a PHP package, which also applies for Laravel specific packages. 
As an example, let's say we'd want to work on the [laravel-medialibrary](https://github.com/spatie/laravel-medialibrary) package.  

### Step 1. Fork the package on GitHub
Fork the package on GitHub, since we (probably) do not have rights to push branches to the main repository. The fork will act as our "working copy" of the package and serves a central place to push branches containing your work.  

### Step 2. Clone your fork
Clone the package from your fork to your local machine. Personally, I have a separate folder for "applications" and "packages".

```bash
cd packages

git clone git@github.com:Jhnbrn90/laravel-medialibrary.git .
```

### Step 3. Configure the upstream (optional)
While optional, I would advise to also configure the repository where we forked the package from as an "upstream" repository. This allows us to pull in changes from this repository at a later stage, for example when a PR was merged into master in the meantime.

We can add this remote by using the `git remote add` command:

```bash
git remote add upstream git@github.com:spatie/laravel-medialibrary.git
```

When you run `git remote -v`, you should now see two separate remotes: "origin" referring to your own repository and "upstream" referring to the originating repository.

### Step 4. Require the package in a (Laravel) project
Now, let's require the cloned package within an application so that we can test the desired functionality or bug fix. This application can for example be a fresh installation of Laravel, but it doesn't have to be.

*Personally, I always create a new Laravel application named "hacktober".*

In this application, you can require the package *locally* instead of via *Packagist*, by defining a custom so called `repository` in the `composer.json` file of the application.

Replace the "url" with the directory where the package lives.

```json
{
  "scripts": { ... },

  "repositories": [
    {
      "type": "path",
      "url": "../../packages/laravel-medialibrary"
    }
  ]
}
```

Since Composer uses the specified `repositories` as a fallback, you'll need to update the name of your package in `composer.json`. Otherwise, it would just pull in the latest version of the laravel-medialibrary by Spatie from Packagist. 

You can rename the package in `composer.json` as follows:

```json
{
  "name": "JhnBrn90/laravel-medialibrary",
  ....
}
```

***Important:*** *make sure to never commit this change!*

Now, require the package in the Laravel application:
 
```bash 
composer require JhnBrn90/laravel-medialibrary
``` 

This will create a *symlink* to the local package instead of installing the package from Packagist.  

### Step 5. Commit, update and submit a PR
All changes you make in the package will now directly be reflected within the application used to test the package.

#### Commit your work
It is good practice to commit your work on a `feature` or `fix` branch, which you can create from either `master` or `develop` (make sure to read the `CONTRIBUTING.MD` documentation for the specifics for the package). 

#### Update (rebase) your PR with latest changes
While you work on an issue or feature, it might happen that another PR was merged before you created yours. 
In that case, it might be a good idea to pull in the latest changes on `master` in the upstream repository. For this step, it is necessary to follow Step 3 first.

Incorporate changes in `master` (or `develop`) in the branch you're currently developing on as follows:

- Make sure all changes on your working branch are committed and the working directory is clean
- Pull in the latest version of `master` from the upstream repository:
  - `git checkout master`
  - `git pull upstream master`
- Rebase your feature branch on the latest version of `master`:
  - `git checkout feature/some-feature`
  - `git rebase master`

#### Push your branch
If you're happy with the current state of your work, you can push the branch to your own fork of the repository.

```bash
git push --set-upstream origin some-feature
```

After pushing your branch, GitHub will most likely provide a URL to directly create a new PR. Alternatively you can create a PR via GitHub's webinterface.

#### Create a new PR
Now that you have a branch which contains your work, you can create a new pull request to `master` or `develop` (according to the `CONTRIBUTING.md` guidelines). Use the "New pull request" button in the Pull Requests tab and make sure to enable "compare across forks". This allows you to create the PR from the branch on your fork to the base repository. 

![Creating a new PR from a fork](create-pr.png)

## Conclusion
I hope the workflow as suggested in this post can help potential first-time (Hacktober) contributors to have the confidence to contribute to a PHP package. 

If you want to learn more about the ins-and-outs of creating a Laravel specific package, make sure to checkout these resources:
 
- [LaravelPackage.com](https://laravelpackage.com)
- [Laravel Package Training](https://laravelpackage.training/)
- [PHP Package Development course](https://phppackagedevelopment.com/)