import { useLocation } from 'react-router-dom';
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
		<footer className="bg-white border-t border-neutral-200 mt-auto">
			<div className="max-w-7xl mx-auto px-6 py-8">
				<div className="flex flex-col md:flex-row items-center justify-between gap-4">
					<div className="flex flex-col md:flex-row items-center gap-4 text-sm text-neutral-600">
						<p>© {year} ChildNest. All rights reserved.</p>
						<Separator orientation="vertical" className="hidden md:block h-4" />
						<div className="flex items-center gap-4">
							<a href="#" className="hover:text-neutral-900 transition-colors">Privacy</a>
							<a href="#" className="hover:text-neutral-900 transition-colors">Terms</a>
							<a href="#" className="hover:text-neutral-900 transition-colors">Contact</a>
						</div>
					</div>
					{user && (
						<p className="text-sm text-neutral-700 font-medium">
							Logged in as {user.name || 'User'}
						</p>
					)}
				</div>
			</div>
		</footer>
	);
};

export default Footer;
