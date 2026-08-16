import Image, { ImageProps } from "next/image";

export function Nook1(props: Partial<ImageProps>) {
   return (
      <Image
         src="/icon1.svg"
         alt=""
         draggable={false}
         width={1}
         height={1}
         loading="eager"
         {...props}
      />
   );
}

export function Nook2(props: Partial<ImageProps>) {
   return (
      <Image
         src="/icon2.svg"
         alt=""
         draggable={false}
         width={1}
         height={1}
         loading="eager"
         {...props}
      />
   );
}

export function Library(props: Partial<ImageProps>) {
   return (
      <Image
         src={"/library.jpg"}
         alt=""
         draggable={false}
         width={2000}
         height={2000}
         loading="eager"
         {...props}
      />
   );
}
