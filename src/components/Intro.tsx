export function Intro() {
    return <div className="p-4 rounded-3 bg-secondary bg-opacity-10">
        <p className="fs-4 fw-bold mb-1 font-heading">Export classes and finals from WebSTAC to Google Calendar.</p>
        <ul>
            <li>Designed for students of Washington University in St. Louis.</li>
            <li>No registration required.</li>
            <li>Just copy and paste from WebSTAC.</li>
            <li>Schedule sent only to Google Calendar, and nobody else <a href="privacy.html">(privacy policy)</a>.</li>
        </ul>
        <div className="d-flex align-items-center">
            <a className="btn btn-primary" href="#root">Scroll down to start</a>
            <span className="px-1">OR</span>
            <a className="btn btn-dark" href="#about">About this site</a>
        </div>
    </div>;
}
