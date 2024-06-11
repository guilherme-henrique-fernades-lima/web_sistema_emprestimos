import "@/styles/globals.css";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";

//Custom components
import Layout from "../components/templates/Layout";
import ContextThemeProvider from "@/context/ContextThemeProvider";

//Mui components
import { CssBaseline } from "@mui/material";

function HeadWebsite() {
  return (
    <Head>
      <title>Sistema de empréstimos</title>
      {/* <meta name="theme-color" content="#1a3d74" />
      <meta name="msapplication-navbutton-color" content="#1a3d74" />
      <meta name="apple-mobile-web-app-status-bar-style" content="#1a3d74" />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/favicon/favicon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest"></link> */}
    </Head>
  );
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();

  const isLoginPage = router.pathname === "/auth/login";

  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={false}
      refetchInterval={15 * 60}
    >
      <CssBaseline />
      <HeadWebsite />
      <ContextThemeProvider>
        {/* Renderiza o Layout apenas se não for a página de login */}
        {!isLoginPage && (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
        {/* Renderiza o Componente diretamente se for a página de login */}
        {isLoginPage && <Component {...pageProps} />}
      </ContextThemeProvider>
    </SessionProvider>
  );
}
