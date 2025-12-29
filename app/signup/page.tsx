import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <SignUp appearance={{
                elements: {
                    rootBox: "mx-auto",
                    card: "bg-[#111] border border-white/10",
                }
            }} />
        </div>
    );
}
