import { SignedIn, SignedOut } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";

const HeaderServer = async () => {
  await checkUser();

  return (
    <div>
      <SignedIn></SignedIn>
      <SignedOut></SignedOut>
    </div>
  );
};

export default HeaderServer;
