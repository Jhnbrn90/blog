I'm John Braun, living in The Netherlands. I'm currently working at [Enrise](https://enrise.com) as a software developer. I created [LaravelPackage.com](https://laravelpackage.com) as an open source tutorial to PHP package development. Contributions are highly welcomed.

This blog is built with [Next JS](https://nextjs.org/) and open source [on GitHub](https://github.com/Jhnbrn90/johnbraun.blog). 

You can find me on [Twitter](https://twitter.com/@jhnbrn90), [LinkedIn,](https://nl.linkedin.com/in/jbraunnl) [GitHub](https://github.com/jhnbrn90) and the [Laracasts forum](https://laracasts.com/@JohnBraun). Since May 2019 I'm a [Laravel Certified](https://exam.laravelcert.com/is/john-braun/certified-since/2019-05-31?) developer.

Previously, I did my PhD research in Organic Chemistry within the [Sythetic & BioOrganic Chemistry group](http://syborch.com) (SyBOrCh) at the [Vrije Universiteit Amsterdam](http://www.vu.nl).

## How I got into programming

### Chemistry

While I was in high school I was already fascinated by programming, however at a certain point my interest in chemistry took over. The science which describes the incredibly tiny particles that make up our world: from the air you breathe to your DNA and (unless you're standing) even the chair you are sitting on while reading this. My desire to understand how all of this works, was a motivation to dig deeper. After studying chemistry, I eventually got a chance to start a PhD in the field of organic chemistry. At the moment of writing, I am doing some final lab work and finishing things up.

### A better workflow

During my PhD, I discovered the potential to enhance our workflow, by writing custom-made tools. Since I had some experience in PHP, creating web applications seemed the obvious choice. Additionally, one of the huge advantages of web applications is that they're device agnostic: it works in the browser and doesn't require any knowledge on building Android or IOS apps. On top of that, I learned that --- in the era of mobile-first applications --- it is really easy to make the site look great on phones and tablets.

### New technologies

I hadn't been keeping up with all the changes in the "programming world" since leaving high school. Therefore, all the greater was my surprise when I discovered what had changed in 13 years: PHP was back in business and a wide variety of frameworks had emerged.

One of these frameworks called [**Laravel**](https://www.laravel.com), made by Taylor Otwell, was especially getting more popular. Laravel's philosophy is aimed at developer happiness, which is immediately evident from the superb documentation. On top of that, first party companion tools like [Laravel **Valet**](https://laravel.com/docs/5.8/valet) (enabling fast, easy local development) and [Laravel **Forge**](https://forge.laravel.com) (easy deployment of projects) really take away the hard work to develop and host your Laravel applications. In addition to Laravel's own solutions, I also want to pay attention to the amazing people at [**Spatie**](https://spatie.be) which create amazingly useful packages and empower the Laravel ecosystem.

However, I'll have to admit that it were the amazing video tutorials by Jeffrey Way on [**Laracasts**](https://www.laracasts.com) which tremendously lowered the entrance barrier to Laravel and motivated me to just get started.

### How Laravel made things better

The first Laravel project I worked on was aimed at improving our inventory database holding a little over 2000 in-house chemicals. The software we used at that time was sharing a **Microsoft Access database** file in a shared **Dropbox** folder. Everyone had reading rights (so they could search) and only our lab manager had rights to write changes to our database. Meaning that our lab manager would need to be notified for each and every update to persist the change (!).

As a consequence, at our yearly '**lab cleaning**' everyone would get handed out to them a printed list. Next, we would run through all chemicals on that list, checking if a chemical was still present, wrongly located or consumed. In the latter cases, adjustments were added on paper and the list would then be returned to our poor lab manager, whose task it was to make all the changes in the actual database file. A horrible task, I aimed to **eliminate** by employing Laravel.

![Chemical Inventory Database](/images/pages/about/inventory.png)

I'm proud that our research group now uses this chemical inventory database application on a daily basis, offering a better experience for its users: everyone can add, update and (soft) delete chemicals and the yearly "labcleaning" now only takes **2 days, instead of a week** and provides a simple wizard guiding the users through chemicals in a certain cabinet.

![Labcleaning Wizard](/images/pages/about/cleaning-wizard.png)

### Programming is fun!

After programming this inventory database, I made a couple of other tools for the group, amongst others: a reservation system for booking our equipment, calculators for our NMR analysis and a Supporting Info Manager (S.I.M.) for managing and automating writing up the *Supporting Info* section of our papers, based on the synthesized (new) compounds.

I re-experienced how fun and satisfactory programming can be and I am eager to keep learning. Through this blog I want to share tips and tricks for (beginning) developers.

![Internal homepage of our research group, featuring the software tools](/images/pages/about/syborch.jpeg)