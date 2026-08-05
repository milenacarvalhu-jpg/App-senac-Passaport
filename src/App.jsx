import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [isFirstTime, setIsFirstTime] = useState('yes');

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
      setCurrentScreen('schedule');
    } else {
      setCurrentScreen('home');
    }
  }, []);

  const getPeriod = () => {
    const hour = new Date().getHours();
    if (hour >= 8 && hour < 12) return 'Manhã';
    if (hour >= 12 && hour < 18) return 'Tarde';
    return 'Noite';
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newUser = {
      fullName: fullName.trim(),
      isFirstTime: isFirstTime === 'yes',
      registeredAt: new Date().toISOString(),
      period: getPeriod()
    };

    localStorage.setItem('userData', JSON.stringify(newUser));
    setUserData(newUser);
    setShowModal(false);
    setCurrentScreen('schedule');
  };

  if (currentScreen === 'loading') return null;

  if (currentScreen === 'schedule') {
    return (
      <div className="schedule-container">
        <header className="schedule-header">
          <h1 className="schedule-title">Cronograma</h1>
          <p className="user-greeting">Olá, {userData?.fullName}</p>
        </header>
        {/* Futuro conteúdo do cronograma ficará aqui */}
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1 className="title">Casa Aberta Senac</h1>
      <p className="subtitle">
        Descubra o seu futuro com o nosso passaporte virtual. Participe das oficinas, carimbe seu passaporte e explore novas possibilidades!
      </p>
      
      <button className="btn-primary" onClick={() => setShowModal(true)}>
        Ver oficinas
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Cadastro</h2>
            <form onSubmit={handleRegister}>
              
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Nome Completo</label>
                <input 
                  type="text" 
                  id="fullName"
                  className="form-input" 
                  placeholder="Digite seu nome"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primeira vez no Senac?</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="firstTime" 
                      value="yes"
                      checked={isFirstTime === 'yes'}
                      onChange={(e) => setIsFirstTime(e.target.value)}
                    />
                    Sim
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="firstTime" 
                      value="no"
                      checked={isFirstTime === 'no'}
                      onChange={(e) => setIsFirstTime(e.target.value)}
                    />
                    Não
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary btn-submit">
                  Entrar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
