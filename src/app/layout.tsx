import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "SPAGHEETAR",
	description: "Fully costumizable tool for string instruments",
	icons: {
		icon: "/favicon.ico",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" style={{ fontSize: "145%" }}>
			<head>
				<meta
					name="google-site-verification"
					content="Al7innzBbzAY8NNbhp6L6vEEYPvvXg2s0sNiSN1Cgd8"
				/>
			</head>
			<Analytics />
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen`}
			>
				{children}
			</body>
		</html>
	);
}
