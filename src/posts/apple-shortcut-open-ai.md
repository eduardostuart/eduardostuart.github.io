---
title: "How to use OpenAI with Apple Shortcuts"
publishedAt: "01-22-2023 20:40:00"
description: "A quick step-by-step how to create an Apple Shortcut integrated with OpenAI"
published: true
layout: "post"
---

In this post I'll explain how to create an Apple Shortcut integrated with OpenAI's GTP-3. If you don't want to read the entire post and just want to use the shortcut, you can [click here](/static/content/files/apple-shortcut-openai/Ask.shortcut) to download it.

The goal of this shortcut will be: I want to ask a question and get an answer (which will be a basic http request-response).

🎥 Here is a short demonstration of how to use the shortcut on an iPhone:

https://www.youtube.com/embed/HUfxK9x-b2M?si=bNX2cqN7D_OMWDez

## Requirements

1. Apple Shortcuts app installed on your iPad, iPhone or Mac.
1. An OpenAI API Secret Key

### Creating an API Secret on OpenAI

To create an API Secret, just go to: [beta.openai.com/account/api-keys](https://beta.openai.com/account/api-keys) and then click on `+ Create new secret key`.
Copy the secret and paste it somewhere safe for now.

### Creating the Apple Shortcut

A quick overview on the Apple Shortcut - what do we need / the steps:

![](/static/content/files/apple-shortcut-openai/overview.png)

1\. On Setup

> ℹ️ Questions added on the setup step will be asked when the shortcut is imported on a different device

Setup questions are only if you want to share the shortcut with someone else. Skip this step if you don't have any plans to share your shortcut.

![](/static/content/files/apple-shortcut-openai/setup.png)

2\. Ask for input - the question we want to ask.
3\. Build the `prompt` text
4\. Request OpenAI API
5\. Parse the response.
6\. Show the response.

![](/static/content/files/apple-shortcut-openai/result-joke.png)

## Step by step

The first thing we need is to define the API Token. For that we'll use a `text` and `set variable` components.

![](/static/content/files/apple-shortcut-openai/step-1.png)

After that, we'll need to request user input. This will be the `prompt` - the question or message we'll send to OpenAI API. Apple Shortcut automatically creates a "variable" for this kind of input, but I prefer to create my own variables to avoid confusion. Just drag and drop a "set variable", define the name and set the value as `Provided Input`.

![](/static/content/files/apple-shortcut-openai/step-2.png)

Now that we have the input, let's include the request part. In this step, first we need to define which URL are we going to request, the method, headers and JSON body.

The base URL that we are going to use is `https://api.openai.com/v1/completions`.

<Info title="More info: beta.openai.com/docs/api-reference/completions">
  Given a prompt, the model will return one or more predicted completions, and can also return the probabilities of alternative tokens at each
  position.
</Info>

Include the two required headers: `Content-type: application/json` and `Authorization: Bearer $token`, where `$token` is the variable value we defined on the first step.

We also need to prepare the JSON body and for that we'll include the following parameters:

- `model`, as Text/String: "text-davinci-003".
- `prompt`, as Text/String: the provided input variable
- `max_tokens`, as Number: 3000
- `temperature`, as Number: 0
- `top_p`, as Number: 1

<Warning>If you get "api secret is not defined" error, make sure there are no spaces around your header key definition.</Warning>

## Download

[If you don't want to create it](https://media.tenor.com/Ojp83PtgfKkAAAAC/thats-not-very-fun-not-fun.gif), you can easly download the shortcut by clicking [here](/static/content/files/apple-shortcut-openai/Ask.shortcut).

## Final thoughts

Apple Shortcuts is a powerful tool, but it is still quite buggy. It crashes frequently, especially when working on more complex shortcuts. Additionally, some simple tasks that can be easily done on mobile require searching through documentation and tutorials to figure out how to do them on MacOS, such as inserting a variable into text (the answer is simply a right-click).

You might need some coding skills (_specially if are working with http requests or the scripting part (conditionals, loops)_) - but nothing advanced.
