---
title: 'Refactoring toward reusable Vue components'
date: '2019-06-28'
cover: 'cover.jpeg'
description: 'Refactoring a Dragonball Z character selection Vue component into a more reusable, generic image-selector using renderless components vs provide/inject.'
---

In this post, I want to highlight possible refactoring strategies toward **resuable** Vue components: **renderless components** *vs* using **Provide/Inject**. To illustrate these strategies, I'll use a ***Dragonball Z*** character selectioncomponent made using [VueJS](https://vuejs.org/) and [Tailwind CSS](https://tailwindcss.com/). For this project I've used Laravel as a backend and some things might be Laravel specific.

![Choosing a Dragonball Z fighter](selector.gif)

## Introduction

This post is divided in three sections. Each section is accompanied by a CodeSandbox demo, illustrating the approach.

### 1. The straightforward approach

It makes sense to focus on the simplest implementation first, and just get it to work. Then, refactor later. In this section we'll build the selector from scratch and I'll remind you of some basic principles.

[View the straightforward approach on CodeSandbox](https://codesandbox.io/s/straightforward-approach-0f77m?fontsize=14)

### 2. The Renderless approach

One way to make your components (more) reusable is taking advantage of Vue's render() function. In this section I'll show you how to take full control of the way your data is displayed (rendered) within the view.

[View the renderless approach on CodeSandbox](https://codesandbox.io/embed/renderless-approach-70cj2?fontsize=14)

### 3. The Provide/Inject approach

Although Renderless components give more flexibility than standard components, a major downside is that all code in your view gets more complicated/verbose. The **Provide / Inject** strategy is somewhere in the middle between the other two strategies.

[View the provide/inject approach on CodeSandbox](https://codesandbox.io/embed/provide-inject-approach-d4cqd?fontsize=14)

**What we want to achieve:**

-   Show 35 avatars of various Dragonball Z characters
-   Make selection by clicking
-   Undo the selection by clicking (again)
-   Store the *id* of the selected character in hidden `<input>` form field

The **Character** model has an *id*, *avatar* and *name* column in the database. The *avatar* column holds the relative path to the image source.

*Note: I will refer to* [*blade directives*](https://laravel.com/docs/5.8/blade)*, which I will not go into detail to in this post.*

---

## 1. The straightforward approach

### Creating the view

Given we have access to a `$characters` variable, which holds an array of characters, like so:

```json
[
  {
    id: 1,
    name: "Goku",
    avatar: "goku.jpeg"
  },
 # and so on...
 ]
```

We might structure our view file as follows:

create.blade.php:

```html
<form action="/fighters" method="POST">
  <!-- other fields -->
  <character-selection
      :characters="{{ $characters }}"
      previous-character="{{ old('character_id') }}"
  />
  <!-- submit button -->
</form>
```

The `:characters` and `previous-character` props we're sending through will be available in our component. We leverage Laravel's `old()` helper to pass the previous selection to the component (on failed submission of the form) to make sure we remember the selected character.

### Creating the Vue component

After you've created the `CharacterSelection.vue` file, register the component globally within `resources/js/app.js`.

*I won't mention this step whenever creating new components in the rest of this post, but please keep in mind that all Vue components mentioned are registered globally.*

resources/js/app.js:

```js
Vue.component(
    'character-selection',
    require('./components/CharacterSelection.vue').default
);
```

### Accepting the props

In the `CharacterSelection` component, we'll accept the `*previous-character*` and `*characters*` props in the `<script>` section.

CharacterSelection.vue:

```vue
<script>
export default {
    props: ['characters', 'previous-character'],
}
</script>
```

### Iterating over all characters

Furthermore, we want to iterate over all characters and show an image in the `<template>` section of our component. From the `<template>` we can only return one root element and therefore have to wrap everything in a parent element, *e.g.* a `<div>`. When iterating over items, due to its reactivity, Vue needs to be able to differentiate between DOM elements which is why we also pass a unique `:key` attribute.

To display the avatars in a grid, we employ flexbox by adding the tailwind CSS classes 'flex' and 'flex-wrap' to wrap as necessary. The images are displayed at a predefined width and height (`w-16` and `h-12`), also using Tailwind CSS classes.

CharacterSelection.vue:

```vue
<template>
  <div class="flex flex-wrap">
    <div
       v-for="character in characters"
       :key="character.id"
    >
      <img
        class="w-16 h-12"
        :src="`/images/fighters/${character.avatar}`"
        :title="character.name"
        :alt="character.name"
      >
    </div>
  </div>
</template>
```

### Adding reactivity

Although we can see the avatars now, there is no reactivity. To help us achieve that, we should employ a dedicated `<single-character>` Vue component representing a single avatar rather than a `<img>`. This child component will receive the character as a prop.

CharacterSelection.vue:

```vue
<template>
    <div class="flex flex-wrap justify-center">

      <single-character
        v-for="character in characters"
        :character="character"
        :key="character.id"
        />

    </div>
</template>
```

In our child component, we first need to make sure to render all avatars properly. We accept the current character and show the image:

SingleCharacter.vue:

```vue
<template>
  <div
    class="(omitted for clarity...)"
  >

    <img :src="avatar" />

  </div>
</template>


<script>
export default {
  props: ['character'],

  computed: {
    avatar() {
      return `/images/fighters/${this.character.avatar}`;
    },
  },
};
</script>
```

Now that the avatars are showing up, let's add some reactivity by adding a click handler (`@click`) and let the parent component know that we've made a choice by emitting an event (`this.$emit`) sending along the character's id.

SingleCharacter.vue:

```vue
<template>
  <div
    class="(omitted for clarity...)"
    @click="selectCharacter"
  >
    <img :src="avatar" />
  </div>
</template>

<script>
export default {
  // ...
  methods: {
    selectCharacter() {
      this.$emit('character-selected', this.character.id);
    },
  },
  // ...
};
</script>
```

To make the parent component capable of listening and acting on this event, we'll need to make some adjustments.

### Listening to the 'character-selected' event

First, we need to listen for an event called `'character-selected'` by specifying an attribute on our child component: `@character-selected` which will call a method that sets the internal property `selectedCharacter` of the parent component to the selected character's id. This value is then bound using `v-bind` to the hidden input field using the `:value` attribute. If the selected id was already selected, we reset the `selectedCharacter` property (to `null`).

CharacterSelection.vue:

```vue
<template>
  <div>
    <div class="flex flex-wrap justify-center">
      <single-character
        @character-selected="selectCharacter"
        v-for="character in characters"
        :character="character"
        :key="character.id"
        :selected="selectedCharacter === character.id"
        />
    </div>

    <input
      type="hidden"
      name="character_id"
      :value="selectedCharacter" />
  </div>
</template>

<script>
export default {
    props: ['characters', 'previous-character'],

    data() {
        return {
            selectedCharacter: parseInt(
                    this.previousCharacter
            )
        }
    },

    methods: {
        selectCharacter(id) {
            if (this.selectedCharacter === id) {
                return (this.selectedCharacter = null);
            }

            this.selectedCharacter = id;
        },
    },
}
</script>
```

### Tell the child which character is currently selected

Lastly, our child component needs to know if it is currently selected. Therefore, we also pass the `:selected` attribute. Within the child component we can accept the value as a prop and let it determine the classes which need to be applied.

SingleCharacter.vue:

```vue
<template>
  <div
    @click="selectCharacter"
    class="(omitted for clarity...)"
    :class="classes"
  >

    <img :src="avatar" />

  </div>
</template>

<script>
export default {
  props: ['character', 'selected'],

  methods: {
    selectCharacter() {
      this.$emit('character-selected', this.character.id);
    },
  },

  computed: {
    avatar() {
      return `/images/fighters/${this.character.avatar}`;
    },

    classes() {
      return this.selected ?
        `border-2 border-black shadow-lg opacity-100` :
        `${this.selected ? 'opacity-35' : 'opacity-85'}`;
    },
  },
};
</script>
```

This concludes our first approach and we have a basic component which does exactly what we want. However, the current implementation is tightly bound to our specific grid of 7 x 5 and contains terminology like 'character' and 'fighters'. What if we want to use this component in a quiz about animals?

---

## 2. Refactoring to a renderless component

Like we concluded from the previous section, the straightforward example works but is hard to reuse. All details regarding styles, layout and image paths of the avatars are hard coded in the components. If those change, we need to create a new component. That's not what we want.

Adam Wathan has a [great post](https://adamwathan.me/renderless-components-in-vuejs/) (and [awesome videos](https://adamwathan.me/advanced-vue-component-design/)!) that describe the goal of renderless components pretty well: *"Separating Presentation and Behavior".*

Ideally, we want to be able to configure (some) behaviour from our view directly as indicated in the HTML below (which will not work, yet). This way, the Vue component allows itself to be "decorated" from within the layout file. Notice that the component's name and the name of the props are more generic. Instead of 'characters', we now have an 'images' prop. Although we changed the name of the prop, we still want to pass our original source of `$characters`.

create.blade.php:

```html
<form action="/fighters" method="POST">

  <image-selector
      pre-selected="{{ old('character_id') }}"
      :images="{{ $characters }}"
      selected-classes="(omitted for clarity...)"
      once-selected-classes="(omitted for clarity...)"
  >

      <div v-for="character in images" :key="character.id">
        <!-- render each image here -->
      </div>

  </image-selector>

  <button type="submit">Submit the form</button>
</form>
```

### How do get access to the `images` variable within our loop?

From here on, I assume you already understand what [Vue's slots](https://vuejs.org/v2/guide/components-slots.html) are and how they work.

Since we try to iterate over a variable `images` which we don't have access to, the listed code above will not work. Here is where **scoped slots** come into play.

A **scoped** slot allows us to pass data from a parent component to a child. The child might then use that data in rendering the **slot** of the parent component.

### Creating the renderless component

Since the templating part will be managed by the layout file and passed back via a single scoped slot, we don't need to provide a template for our component. By definition, renderless components don't have a `<template>` section, just a `<script>` section. Here we can still accept any props and declare the `render()` function, which will pass any variables ('slot props') back to the child component. For our `images` prop, that would look as follows:

ImageSelector.vue:

```vue
<script>
export default {
    props: ['images'],

    render() {
       return this.$scopedSlots.default({
          images: this.images
       });
    }
}
</script>
```

### Using the slot props in our layout file

To loop over the images in our current layout file, we will need to extract the images variable from the slot scope. Note that the syntax has been updated in Vue 2.6.0+ from using `slot-scope` to `v-slot` ([more info](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots)).

create.blade.php:

```html
<form action="/fighters" method="POST">

  <image-selector
      pre-selected="{{ old('character_id') }}"
      :images="{{ $characters }}"
      selected-classes="(omitted for clarity...)"
      once-selected-classes="(omitted for clarity...)"
  >

   <template v-slot="{ images }">
       <!-- we need to return a single root node -->
       <div class="flex">
          <div v-for="character in images" :key="character.id">
            <!-- render each image here -->
          </div>
       </div>
   </template>
  </image-selector>

  <button type="submit">Submit the form</button>
</form>
```

### Adding reactivity

To bring the component to life, *i.e.* adding reactivity, let's add the `props`, `data()` and `methods()` from the `SingleCharacter.vue` and `CharacterSelection.vue` components (from the previous, 'straightforward' approach) and insert them above our `render()` function.

### Sharing data via the `render()` function

To keep the component as generic as possible, we'll catch any events using Vue's `v-on` directive and proxy them through to the `imageEvents()` method, which registers handlers for specific actions. In our case, the click event. The props are passed through using `imageProps()`.

Since we want to use `v-bind` on the input field, we'll also need to offer the selected image as a 'value' through the `inputProps()` method.

ImageSelector.vue:

```vue
<script>
  export default {
    props: [
      'images',
      'preSelected',
      'selectedClasses',
      'onceSelectedClasses',
    ],

    data() {
      return {
        selectedImage: parseInt(this.preSelected),
      }
    },

    methods: {
      selectImage(image) {
        if (this.selectedImage === image.id) {
          return this.selectedImage = null;
        }

        this.selectedImage = image.id;
      },

      classes(image) {
        return this.selectedImage === image.id ? 
          this.selectedClasses : 
          `${this.selectedImage ? this.onceSelectedClasses : '' }`
      },
    },

    render() {
      return this.$scopedSlots.default({
        images: this.images,

        inputProps: {
          value: this.selectedImage,
        },

        imageProps: (image) => ({
          selected: this.selectedImage,
          class: this.classes(image),
        }),

        imageEvents: image => ({
          click: () => {
            this.selectImage(image)
          }
        }),
      });
    }
  }
</script>
```

### Use variables in the view

Now, from within our blade view file we can leverage destructuring to obtain each key.

create.blade.php:

```html
<form action="/fighters" method="POST">

  <image-selector 
    :images="{{ $characters }}" 
    pre-selected="{{ old('character_id') }}" 
    selected-classes="border-2 border-black shadow-lg opacity-100"
    once-selected-classes="opacity-35"
  >
    <template 
      v-slot="{ 
        images, 
        imageProps, 
        imageEvents, 
        inputProps 
      }"
    >

    <div class="single-root-element">
        <div class="flex flex-wrap justify-center">

          <div
            v-for="character in images"
            :key="character.id"
            class="(classes for an image...)" 
            v-on="imageEvents(character)"
            v-bind="imageProps(character)"
          >

            <img
              :src="`/images/fighters/${character.avatar}`"
            >
          </div>

        </div>

        <input
          type="text"
          name="character_id"
          v-bind="inputProps"
        />
      </div>
    </template>
  </image-selector>

  <button type="submit">Submit form</button>
</form>
```

### That's it. We have a reusable component!

We now have a customizable component which can be reused amongst other projects.

A downside to this approach is that it generates a lot of extra code and it results in a somewhat more complex layout file. However, since we have a configurable, reusable component it is possible to generate pre-configured components which are composed by one or more renderless components.

---

## 3. Alternative: using Provide / Inject

Vue offers another solution, which falls somewhere in the middle between the "straightforward" and renderless approach. It gives more flexibility to configure the component in the view template, while generating a less verbose layout file.

In our view, we render a `<single-character>` component within a `<character-selection>` wrapper.

create.blade.php:

```html
<character-selection
  previous-character="{{ old('character_id') }}"
>
    @foreach ($characters as $character)
        <!-- Looping over Single Character component -->
        <single-character
          class="(omitted for clarity...)"
          :character="{{ $character }}"
          imageurl="/images/fighters/{{ $character->avatar }}"
          selected-classes="(omitted for clarity...)"
        />
    @endforeach
</character-selection>
```

At this stage, all looks very familiar to our first approach, except that we're taking care of looping over `<single-character>` in the view instead of in the `<character-selection>` Vue parent component.

Now, instead of emitting an event from our child component to the parent, state will be shared in a `characterSelectionState` property. This property will be provided by the parent component and injected into the child component. **The child component, however, can manipulate this shared (reactive) property**.

Here, we **provide** a shared variable `characterSelectionState` using the `provide()` method:

CharacterSelection.vue:

```vue
<template>
   <div>
       <div class="flex flex-wrap justify-center">
           <slot></slot>
       </div>

       <input
          type="hidden"
          name="character_id"
          :value="sharedState.selectedCharacter"
       >

   </div>
</template>

<script>
   export default {
       props: ['previous-character'],

       provide() {
           return {
               characterSelectionState: this.sharedState
           }
       },

       data() {
           return {
               sharedState: {
                   selectedCharacter: parseInt(
                      this.previousCharacter
                     ),
               }
           }
       },
   }
</script>
```

In SingleCharacter.vue we **inject** the `characterSelectionState` variable, making it available:

SingleCharacter.vue:

```vue
<template>
   <div @click="selectCharacter" :class="classes">
       <img :src="imageurl">
   </div>
</template>

<script>
   export default {
       props: ['character', 'imageUrl', 'selectedClasses'],

       inject: ['characterSelectionState'],

       methods: {
           selectCharacter() {
               this.characterSelectionState
                 .selectedCharacter = this.active ?
                      null : this.character.id;
           }
       },

       computed: {
           active() {
               return this.characterSelectionState
                  .selectedCharacter === this.character.id;
           },

           classes() {
               return this.active ?
                     this.selectedClasses : '';
           },
       }
   }
</script>
```

---

## Conclusion

In conclusion, Vue offers a couple of nice possibilities which allows us to write reusable components:

- **Renderless components** give full control over how they are rendered since their behaviour is completely decoupled. However, in the end, you do create a more complex component **and** you end up with more verbose code in your view template.

- Vue's **Provide/Inject** methods can be a useful intermediate solution if you don't need a full blown completely configurable renderless component, but still want some configurational flexibility.

Each of the three approaches mentioned in this post have their use. Each approach has their advantages and downsides.

---

## Encore

### The power of Renderless Components

Disclaimer: I would advise to always go with the **simplest** option for your specific needs. Don't create a renderless component when all you need is a simple component that you'll only use once.

[View the multiple images approach on CodeSandbox](https://codesandbox.io/embed/renderless-select-multiple-characters-j39lo?fontsize=14)

### Selecting Multiple Images, using our renderless component

So far, we can use our renderless component to display any set of images in a particular way. However, what if we want to select **multiple** images?

With a little tweak to our renderless component, we can come up with the following solution:

create.blade.php:

```html
<multiple-image-selector
 :images="{{ $characters }}"
 selected-classes="border-2 border-black shadow-lg opacity-100"
 once-selected-classes="opacity-35"
>
  <template v-slot="{
    ﻿images,
    imageProps,
    imageEvents,
    inputProps
   }"
  >

    <div class="single-root-element">

      <div class="flex flex-wrap justify-center">

        <div
          v-for="character in images"
          :key="character.id"
          class="(omitted for clarity...)"
          v-on="imageEvents(character)"
          v-bind="imageProps(character)"
         >

           <img :src="`/images/fighters/${character.avatar}`">

         </div>

      </div>

      <input
        type="text"
        name="character_id"
        v-bind="inputProps"
      >

    </div>

  </template>
</multiple-image-selector>
```

Then, in our renderless `MultipleImageSelector.vue` component:

MultipleImageSelector.vue:

```vue
<script>
  export default {
    props: [
      'images',
      'selected-classes',
      'once-selected-classes'
    ],

    data() {
      return {
        selectedImages: [],
      }
    },

    methods: {
      selectImage(image) {
        let index = this.selectedImages.indexOf(image.id);

        if (index > -1) {
          return this.selectedImages.splice(index, 1);
        }

        return this.selectedImages.push(image.id);
      },

      classes(image) {
        return
          this.selectedImages.indexOf(image.id) > -1 ?
            this.selectedClasses :
              `${this.selectedImages.length > 0 ?
                 this.onceSelectedClasses : '' }`
      },
    },

    render() {
      return this.$scopedSlots.default({
        images: this.images,

        inputProps: {
          value: this.selectedImages,
        },

        imageProps: (image) => ({
          selected: this.selectedImage,
          class: this.classes(image),
        }),

        imageEvents: image => ({
          click: () => {
            this.selectImage(image)
          }
        }),
      });
    }
 }
</script>
```