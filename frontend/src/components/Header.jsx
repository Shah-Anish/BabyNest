import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const Header = () => {
	const location = useLocation();
	const navigate = useNavigate();

	let user = null;
	try {
		const rawUser = localStorage.getItem('user');
		user = rawUser ? JSON.parse(rawUser) : null;
	} catch {
		user = null;
	}

	const token = localStorage.getItem('token');
	const isLoggedIn = Boolean(token);
	const role = user?.role || 'guest';

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		navigate('/login');
	};

	const isActive = (path) => location.pathname === path;

	return (
			<header className="bg-card/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
					<Link to="/" className="text-xl font-semibold text-foreground tracking-tight hover:opacity-80 transition-opacity">
					BabyNest
				</Link>

				<nav className="flex items-center gap-6">
					<div className="hidden md:flex items-center gap-1">
						<Link
							to="/"
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
								isActive('/')
									? 'text-foreground'
									: 'text-muted-foreground hover:text-foreground hover:bg-secondary'
							}`}
						>
							Home
						</Link>

						{!isLoggedIn && (
							<>
								<Link
									to="/login"
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
										isActive('/login')
										? 'text-foreground'
										: 'text-muted-foreground hover:text-foreground hover:bg-secondary'
									}`}
								>
									Login
								</Link>
							</>
						)}
					</div>

					<div className="flex items-center gap-3">
						{isLoggedIn && (
							<span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground ring-1 ring-inset ring-border">
								{role}
							</span>
						)}

						{!isLoggedIn ? (
							<Link to="/register">
								<Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 h-9">
									Sign Up
								</Button>
							</Link>
						) : (
							<Button
								onClick={handleLogout}
								size="sm"
								variant="outline"
								className="rounded-full border-border hover:bg-secondary h-9"
							>
								Logout
							</Button>
						)}
					</div>
				</nav>
			</div>
		</header>
	);
};

export default Header;
