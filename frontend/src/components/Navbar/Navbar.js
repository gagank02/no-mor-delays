import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserAuth } from "../UserAuth/UserAuth";
import styles from './Navbar.module.css';

const Navbar = () => {
	const { user, login, logout } = useContext(UserAuth);

	return (
		<nav className={styles.navbar}>
			<div className={styles.navbar__left}>
				<Link to="/">NoMorDelays</Link>
			</div>
			<div className={styles.navbar__right}>
				<Link to="/search">Search</Link>
				<Link to="/analyze">Analyze</Link>
				<Link to="/report">Report a Delay</Link>
				<Link to="/visualize">Visualize</Link>
				{user
					? (<Link onClick={logout} className={styles.logout}>Logout</Link>)
					: (<Link to="/login" className={styles.login}>Login</Link>)
				}
			</div>
		</nav>
	);
}

export default Navbar