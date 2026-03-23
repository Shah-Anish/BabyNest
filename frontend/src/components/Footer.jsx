import { Link, useLocation } from 'react-router-dom';
import { Separator } from './ui/separator';

const Footer = () => {
	useLocation();

	let user = null;
	try {
		const rawUser = localStorage.getItem('user');
		user = rawUser ? JSON.parse(rawUser) : null;
	} catch {
		user = null;
	}

	const year = new Date().getFullYear();

	return (
			<footer className="bg-card border-t border-border mt-auto">
				<div className="max-w-7xl mx-auto px-6 py-8">
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						<div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
						<p>© {year} BabyNest. All rights reserved.</p>
						<Separator orientation="vertical" className="hidden md:block h-4" />
						<div className="flex items-center gap-4">
								<a href="#" className="hover:text-foreground transition-colors">Privacy</a>
								<a href="#" className="hover:text-foreground transition-colors">Terms</a>
								<Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
						</div>
					</div>
					{user && (
							<p className="text-sm text-foreground font-medium">
							Logged in as {user.name || 'User'}
						</p>
					)}
				</div>
			</div>
		</footer>
	);
};

export default Footer;
