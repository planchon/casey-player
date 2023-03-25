import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata = {
    title: "Casey N. Binge Watching Tool",
    description: "Binge watch casey neistat without loosing where you were",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
            <Analytics />
        </html>
    );
}
