import { useState, useEffect } from 'react';
import './App.css';

function App() {
	const [timerType, setTimerType] = useState('session');
	const [time, setTime] = useState(25 * 60);
	const [breakTime, setBreakTime] = useState(5 * 60);
	const [sessionTime, setSessionTime] = useState(25 * 60);
	const [isRunning, setIsRunning] = useState(false);

	const formatTime = (time) => {
		const minuts = Math.floor(time / 60);
		const seconds = time % 60;
		return (
			(minuts < 10 ? '0' + minuts : minuts) +
			':' +
			(seconds < 10 ? '0' + seconds : seconds)
		);
	};

	const reset = () => {
		document.getElementById('beep').pause();
		document.getElementById('beep').currentTime = 0;
		setTime(25 * 60);
		setIsRunning(false);
		setTimerType('session');
		setBreakTime(5 * 60);
		setSessionTime(25 * 60);
	};

	const controllTimeLength = (e) => {
		if (isRunning) return;
		const elId = e.target.id;
		const typeIndex = elId.indexOf('-');
		const type = elId.slice(0, typeIndex);

		if (type === 'break') {
			if (elId === 'break-increment') {
				setBreakTime((prev) => {
					if (prev === 60 * 60) return prev;
					return prev + 60;
				});
			} else if (elId === 'break-decrement') {
				setBreakTime((prev) => {
					if (prev === 60) return prev;
					return prev - 60;
				});
			}
		} else {
			if (elId === 'session-increment') {
				setSessionTime((prev) => {
					if (prev === 60 * 60) return prev;
					return prev + 60;
				});
			} else if (elId === 'session-decrement') {
				setSessionTime((prev) => {
					if (prev === 60) return prev;
					return prev - 60;
				});
			}
		}
	};

	useEffect(() => {
		setTime(sessionTime);
	}, [sessionTime]);

	const changeSession = () => {
		if (time === 0) {
			document.getElementById('beep').play();
			setIsRunning(true);
			if (timerType === 'session') {
				setTime(breakTime);
				setTimerType('break');
			} else {
				setTime(sessionTime);
				setTimerType('session');
			}
		}
	};

	useEffect(() => {
		changeSession();

		if (isRunning) {
			let id = setInterval(() => {
				setTime((prev) => {
					if (prev === 0) {
						setIsRunning(false);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
			return () => clearInterval(id);
		}
	}, [isRunning]);

	return (
		<div className="App">
			<div className="timer">
				<div className="timer-wrapper">
					<div id="timer-label">{timerType}</div>
					<div id="time-left">{formatTime(time)}</div>
					<button id="reset" onClick={() => reset()}>
						reset
					</button>
				</div>
				<div className="session-controlls">
					<TimerLengthControll
						type="break"
						length={breakTime}
						format={formatTime}
						title="Break Length"
						controllTimeLength={controllTimeLength}
					/>
					<TimerLengthControll
						type="session"
						length={sessionTime}
						format={formatTime}
						title="Session Length"
						controllTimeLength={controllTimeLength}
					/>
				</div>
				<div className="timer-controll">
					<button id="start_stop" onClick={() => setIsRunning((prev) => !prev)}>
						<i className="fas fa-play-circle fa-3x"></i>
						<i className="fas fa-pause-circle fa-3x"></i>
					</button>
				</div>
			</div>
		</div>
	);
}

const TimerLengthControll = ({
	type,
	length,
	format,
	title,
	controllTimeLength,
}) => {
	return (
		<div id={`${type}-label`}>
			<div className="session">
				<div id={`${type}-label`} className="title">
					{title}
				</div>
				<div id={`${type}-length`} className="length">
					{length / 60}
				</div>
			</div>
			<div className="session-btn-wrapper">
				<button id={`${type}-increment`} onClick={(e) => controllTimeLength(e)}>
					<i className="fa fa-arrow-up fa-2x" />
				</button>
				<button id={`${type}-decrement`} onClick={(e) => controllTimeLength(e)}>
					<i className="fa fa-arrow-down fa-2x" />
				</button>
			</div>
			<audio
				id="beep"
				preload="auto"
				src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
			/>
		</div>
	);
};

export default App;
