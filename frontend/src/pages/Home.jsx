import { Link } from 'react-router-dom'
import '../App.css'

function Home() {
    return (
        <div className="app">
            <header className="app-header">
                <h1>Welcome to My Finance</h1>
            </header>
            <main className="app-main" style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Track your stocks and transactions efficiently.</p>
                <div style={{ marginTop: '2rem' }}>
                    <Link to="/stocks" className="button" style={{
                        padding: '10px 20px',
                        backgroundColor: '#646cff',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px'
                    }}>
                        Go to Stock Dashboard
                    </Link>
                </div>
            </main>
        </div>
    )
}

export default Home
