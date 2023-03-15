import '../styles/app.css';

export default function App({ Component, pageProps }: AppProps): React.ReactNode {
    return <Component {...pageProps} />;
}
