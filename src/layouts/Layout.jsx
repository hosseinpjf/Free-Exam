import Header from "./Header"

function Layout({ children }) {
    return (
        <div>
            <Header />
            <div style={{ minHeight: 'calc(100dvh - 150px)', width: '95%', margin:'0 auto 30px' }}>
                {children}
            </div>
        </div>
    )
}

export default Layout