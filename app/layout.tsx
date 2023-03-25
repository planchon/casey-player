import "./globals.css";

export const metadata = {
    title: "CaseyNeistat binge watching tool",
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
        </html>
    );
}
