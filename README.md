## Facial Recognition Web App
This is a web app I created to beef up my resume a little bit, this project uses face-api.js.
The user can use the camera on their device to take a picture of their face and give themselves a name.
This will add their face to a db and this image will also be put in the public folder of the project.
This being said any image taken on the website will be publicly available until the image is deleted using the user interface.
Once the website is given at least one face it will start to recognize that person or those people.
The api also allows us to detect mood, so if someone is sad or happy we should be able to tell the difference between the two.

For some reason I decided to use css for this project while also using typescript.

The project can be found live at [`facialrecognition.ramsaysdetailing.ca`](https://facialrecognition.ramsaysdetailing.ca/)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
