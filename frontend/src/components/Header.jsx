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
		<header className="bg-white/80 backdrop-blur-xl border-b border-neutral-200/50 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
				<Link to="/" className="text-xl font-semibold text-neutral-900 tracking-tight hover:opacity-80 transition-opacity">
					ChildNest
				</Link>

				<nav className="flex items-center gap-6">
					<div className="hidden md:flex items-center gap-1">
						<Link
							to="/"
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
								isActive('/')
									? 'text-neutral-900'
									: 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
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
											? 'text-neutral-900'
											: 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
									}`}
								>
									Login
								</Link>
							</>
						)}
					</div>

					<div className="flex items-center gap-3">
						{isLoggedIn && (
							<span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 ring-1 ring-inset ring-neutral-200">
								{role}
							</span>
						)}

						{!isLoggedIn ? (
							<Link to="/register">
								<Button size="sm" className="rounded-full bg-neutral-900 hover:bg-neutral-800 h-9">
									Sign Up
								</Button>
							</Link>
						) : (
							<Button
								onClick={handleLogout}
								size="sm"
								variant="outline"
								className="rounded-full border-neutral-300 hover:bg-neutral-50 h-9"
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
