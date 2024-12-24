import Header from './hfcomponents/Header';
import Footer from './hfcomponents/Footer';
import { ReactNode } from 'react'; // 追加

export const metadata = {
  title: 'Croquis',
  description: '固定ヘッダーとフッター付きのNext.jsアプリ',
};

interface RootLayoutProps {
  children: ReactNode; // 追加
}

const bodyStyle = {
  margin: '0 ',
  padding: 0,
  
};

const mainStyle = {
  paddingTop: '80px', // ヘッダーの高さ分の余白
  paddingBottom: '50px', // フッターの高さ分の余白
  minHeight: '100vh',
  boxSizing: 'border-box' as const,
  margin: 'auto',
   backgroundColor: 'rgb(220,220,220)'
};


export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" style={{ fontFamily: 'Raleway, sans-serif', backgroundColor: 'rgb(220,220,220)', fontSize: '20px' }}>
      <body style={bodyStyle}>
        <Header />
        <main style={mainStyle}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
