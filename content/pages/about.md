I'm John Braun, living in The Netherlands. I'm a software developer working mostly with Laravel and created [LaravelPackage.com](https://laravelpackage.com) as an open-source tutorial to PHP package development.

This blog is built with [Next JS](https://nextjs.org/) and open source [on GitHub](https://github.com/Jhnbrn90/johnbraun.blog).

You can find me on [Twitter](https://twitter.com/@jhnbrn90), [LinkedIn,](https://nl.linkedin.com/in/jbraunnl) [GitHub](https://github.com/jhnbrn90) and the [Laracasts forum](https://laracasts.com/@JohnBraun). Since May 2019 I'm a [Laravel Certified](https://exam.laravelcert.com/is/john-braun/certified-since/2019-05-31?) developer.

Previously, I did my PhD research in Organic Chemistry within the [Sythetic & BioOrganic Chemistry group](http://syborch.com) (SyBOrCh) at the [Vrije Universiteit Amsterdam](http://www.vu.nl).

## How I got into programming

### Chemistry

While I was in high school, I was already fascinated by programming; however, my interest in chemistry took over at a certain point. Chemistry: the science that describes the incredibly tiny particles that make up our world: from the air you breathe to your DNA and (unless you're standing) even the chair you are sitting on while reading this. My desire to understand how all of this works motivated me to dig deeper. After studying chemistry, I eventually got a chance to start my PhD research in Organic Chemistry.

### A better workflow

During my time in the research group, I discovered the potential to enhance our workflow by creating custom-made tools. Since I had some experience in PHP, creating web applications seemed the obvious choice. Additionally, one of the vast advantages of web applications is that they're device-agnostic: it works in the browser and doesn't require any knowledge on building Android or IOS apps. On top of that, I learned that it is effortless to make the site look great on phones and tablets in the era of mobile-first applications.

### New technologies

Soon I discovered PHP was back in business as it had improved a lot since version 7, and a wide variety of frameworks had emerged.

One of these frameworks, [**Laravel**](https://www.laravel.com), was getting more and more popular. Laravel's philosophy is aimed at developer happiness, which is immediately evident from the great documentation. On top of that, first-party companion tools like [Laravel **Valet**](https://laravel.com/docs/5.8/valet) (enabling fast, easy local development) and [Laravel **Forge**](https://forge.laravel.com) (easy deployment of projects) really take away the hard work to develop and host your Laravel applications. In addition to Laravel's own solutions, I also want to pay attention to the fantastic people at [**Spatie**](https://spatie.be), which create helpful packages and empower the Laravel ecosystem.

Additionally, I'll have to admit that the fantastic video tutorials by Jeffrey Way on [**Laracasts**](https://www.laracasts.com) tremendously lowered the entrance barrier to Laravel and motivated me to just get started.

### How Laravel made things better

The first Laravel project I worked on was to improve our inventory database, holding a little over 2000 in-house chemicals. At that time, the software we used was sharing a *Microsoft Access database* file in a shared *Dropbox* folder. Everyone had reading rights (so they could search), and only our lab manager had the right to write changes to our database. Meaning that our lab manager needs to be notified for each update to persist the change (!).

Consequently, at our yearly '**lab cleaning**', everyone would get handed out to them a printed list. Next, we would run through all chemicals on that list, checking if a chemical was still present, wrongly located, or consumed. In the latter cases, adjustments were added on paper, and the report would then be returned to our poor lab manager, whose task was to make all the changes in the actual database file. A horrible job, I aimed to **eliminate** by employing Laravel.

![Chemical Inventory Database](/images/pages/about/inventory.png)

I'm proud that our research group now uses this chemical inventory application daily, offering a better experience for its users. Everyone can add, update and (soft) delete chemicals. The yearly "lab cleaning" now only takes **2 days, instead of a week** and provides a simple wizard guiding the users through chemicals in a specific cabinet.

![Labcleaning Wizard](/images/pages/about/cleaning-wizard.png)

### Programming is fun!

After programming this inventory database, I made a couple of other tools for the group, amongst others: a reservation system for booking our equipment, calculators for our NMR analysis, and a Supporting Info Manager (S.I.M.) for managing and automating writing up the *Supporting Info* section of our papers, based on the synthesized (new) compounds.

I re-experienced how fun and satisfactory programming can be, and I am eager to keep learning. Through this blog, I want to share tips and tricks for (beginning) developers.

![Internal homepage of our research group, featuring the software tools](/images/pages/about/syborch.jpeg)
