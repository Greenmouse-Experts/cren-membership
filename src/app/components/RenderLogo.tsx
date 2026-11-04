export default function RenderLogo(props: any) {
  return (
    <div className="w-full  h-32  flex">
      <a href="/" className="h-32 w-full ">
        <img src={"/logo.png"} className="!size-full object-contain" alt="logo" />
      </a>
    </div>
  );
}
