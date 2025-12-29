import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function InviteHandler() {
    const { referralCode } = useParams<{ referralCode: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (referralCode) {
            console.log('[REFERRAL] Captured code:', referralCode);
            localStorage.setItem('referralCode', referralCode);
        }

        // Redirect to signup page
        navigate('/login?mode=signup', { replace: true });
    }, [referralCode, navigate]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Processing invitation...</p>
            </div>
        </div>
    );
}
