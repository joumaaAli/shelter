function Welcome() {
  return (
    <div className="home-page">
      <div className="container my-5">
        <div className="row">
          <div className="col-lg-12 d-flex flex-column align-items-center justify-content-center">
            <h2 className="fs-1 mb-5 text-uppercase fw-bold">
              {"L'URPS-mk Guadeloupe en quelques mots"}
            </h2>
            <p>
              {
                "L'URPS Guadeloupe, qui représente l'Union Régionale des Professionnels de Santé, joue un rôle central dans la coordination et l'amélioration de la qualité des soins de santé en Guadeloupe. Son engagement se manifeste à travers la promotion de la santé, la formation continue des kinésithérapeutes, l'analyse des besoins de santé, la gestion des crises sanitaires, et d'autres missions essentielles visant à garantir des soins de qualité à la population locale. En tant qu'acteur majeur du secteur de la santé, l'URPS Guadeloupe contribue de manière active à l'optimisation du système de santé dans la région."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
