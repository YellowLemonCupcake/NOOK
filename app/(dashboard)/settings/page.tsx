import ChangeEmail from "./_components/ChangeEmail";
import ChangePassword from "./_components/ChangePassword";

export default async function SettingsPage() {
   return (
      <div className="min-h-[calc(100dvh-85px)] bg-[#34A853] p-5 select-none">
         <div className="mx-auto max-w-100">
            <ChangeEmail />
            <ChangePassword />
         </div>
      </div>
   );
}
