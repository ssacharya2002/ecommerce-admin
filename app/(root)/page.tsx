import { UserButton } from "@clerk/nextjs";

const SetupPage = () => {
  return <div className="p-5">
    
    <UserButton afterSignOutUrl="/" />
    
    </div>;
};
export default SetupPage;
