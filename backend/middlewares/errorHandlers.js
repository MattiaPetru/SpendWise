export const badRequestHandler = (err, req, res, next) => {
  if (err.status === 400 || err.name === "ValidationError") {
    res.status(400).json({
      error: "RICHIESTA NON VALIDA",
      message: err.message,
    });
  } else {
    next(err);
  }
};

export const unauthorizedHandler = (err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).json({
      error: "ERRORE DI AUTENTICAZIONE",
      message: "Autenticazione richiesta",
    });
  } else {
    next(err);
  }
};

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: "RISORSA NON TROVATA",
    message: "La risorsa richiesta non esiste",
  });
};

export const genericErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "ERRORE INTERNO DEL SERVER",
    message: "Si è verificato un errore imprevisto",
  });
};