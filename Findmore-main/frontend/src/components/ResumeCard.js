import '../styles/resumeCard.css';

export default function ResumeCard({ icon, title, subtitle }) {
	return (
		<div className="resume-card-wrapper">
			<img src={icon} alt='' />
			<div>
				<h1>{`${title}`}</h1>
				<h2>{subtitle}</h2>
			</div>
		</div>
	);
}
