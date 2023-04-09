import { Link } from "react-router-dom";
import styles from './Navbar.module.css';

const Navbar = () => {
	return (
		<nav className={styles.navbar}>
			<div className={styles.navbar__left}>
				<Link to="/">NoMorDelays</Link>
			</div>
			<div className={styles.navbar__right}>
				<Link to="/search">Search</Link>
				<Link to="/analyze">Analyze</Link>
				<Link to="/report">Report a Delay</Link>
				<button className={styles.loginButton}>Login</button>
			</div>
		</nav>
	);
}

export default Navbar