"use client";

import UserSidebar from "@/components/profile/UserSidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { status } = useSession();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.replace("/auth/login");
		} else if (status === "authenticated") {
			setIsLoading(false);
		}
	}, [status, router]);

	if (isLoading || status === "loading") {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	if (status === "unauthenticated") {
		return null; // در حال هدایت...
	}

	return (
		<div dir="rtl" className="relative min-h-screen bg-gray-50 overflow-hidden">
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 opacity-90" />
			<div className="pointer-events-none absolute -top-32 -right-20 w-72 h-72 bg-purple-200/50 rounded-full blur-3xl animate-blob-float-1" />
			<div className="pointer-events-none absolute -bottom-40 left-[-120px] w-80 h-80 bg-pink-200/50 rounded-full blur-3xl animate-blob-float-2" />
			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex flex-col md:flex-row gap-8">
					<div className="w-full md:w-80 flex-shrink-0">
						<UserSidebar />
					</div>
					<div className="flex-1">{children}</div>
				</div>
			</div>
		</div>
	);
}
