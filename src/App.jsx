import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [isFirstTime, setIsFirstTime] = useState('yes');

  // Oficinas state
  const [oficinas, setOficinas] = useState([]);
  const [loadingOficinas, setLoadingOficinas] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
      setCurrentScreen('schedule');
    } else {
      setCurrentScreen('home');
    }
  }, []);

  useEffect(() => {
    if (currentScreen === 'schedule') {
      setLoadingOficinas(true);
      fetch('/oficinas.json')
        .then(res => res.json())
        .then(data => {
          // Filtrar link vazio no final do JSON
          const validas = data.filter(o => o.titulo && o.titulo !== 'Links Relacionados');
          setOficinas(validas);
        })
        .catch(err => console.error("Erro ao buscar oficinas:", err))
        .finally(() => setLoadingOficinas(false));
    }
  }, [currentScreen]);

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
        
        <div className="oficinas-section">
          <h2 className="section-title">Oficinas Disponíveis</h2>
          {loadingOficinas ? (
            <p>Carregando oficinas...</p>
          ) : (
            <div className="oficinas-grid">
              {oficinas.map((oficina, index) => (
                <div key={index} className="oficina-card">
                  <div className="oficina-card-header">
                    <span className="oficina-categoria">{oficina.categoria.replace('.', '')}</span>
                  </div>
                  <h3 className="oficina-titulo">{oficina.titulo}</h3>
                  
                  <div className="oficina-info">
                    {oficina.local && (
                      <span className="info-item">
                        📍 {oficina.local}
                      </span>
                    )}
                    {oficina.horarios && oficina.horarios.length > 0 && (
                      <span className="info-item">
                        ⏰ {oficina.horarios[0]} {oficina.horarios.length > 1 ? `(+${oficina.horarios.length - 1})` : ''}
                      </span>
                    )}
                  </div>
                  
                  <button className="btn-secondary btn-full" onClick={() => alert('Em breve: Detalhes da Oficina')}>
                    Ver Detalhes
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
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
