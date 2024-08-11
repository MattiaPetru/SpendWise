import express from "express";
import Spesa from "../models/Spesa.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import cloudinaryUploader from "../config/cloudinaryConfig.js";
import mongoose from "mongoose";

const router = express.Router();

router.use(authMiddleware);

// GET /spese: ritorna tutte le spese dell'utente
router.get("/", async (req, res) => {
  try {
    const spese = await Spesa.find({ utente: req.user._id }).sort({ data: -1 });
    res.json(spese);
  } catch (error) {
    console.error('Errore nel recupero delle spese:', error);
    res.status(500).json({ messaggio: error.message });
  }
});

// GET /spese/mensili-dettagliate: ritorna le spese mensili dettagliate dell'utente
router.get("/mensili-dettagliate", async (req, res) => {
  try {
    const speseMensiliDettagliate = await Spesa.aggregate([
      { $match: { utente: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $group: {
          _id: {
            mese: { $dateToString: { format: "%Y-%m", date: "$data" } },
            categoria: "$categoria"
          },
          totale: { $sum: "$importo" }
        }
      },
      {
        $group: {
          _id: "$_id.mese",
          categorie: {
            $push: {
              k: "$_id.categoria",
              v: "$totale"
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          categorieObj: { $arrayToObject: "$categorie" }
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$categorieObj", { _id: "$_id" }]
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(speseMensiliDettagliate);
  } catch (error) {
    console.error('Errore nel recupero delle spese mensili dettagliate:', error);
    res.status(500).json({ messaggio: error.message });
  }
});

// GET /spese/trimestrali: ritorna le spese trimestrali dell'utente
router.get("/trimestrali", async (req, res) => {
  try {
    const speseTrimestrali = await Spesa.aggregate([
      { $match: { utente: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $group: {
          _id: {
            trimestre: {
              $concat: [
                { $toString: { $year: "$data" } },
                "-Q",
                { $toString: { $ceil: { $divide: [{ $month: "$data" }, 3] } } }
              ]
            },
            categoria: "$categoria"
          },
          totale: { $sum: "$importo" }
        }
      },
      {
        $group: {
          _id: "$_id.trimestre",
          categorie: {
            $push: {
              k: "$_id.categoria",
              v: "$totale"
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          categorieObj: { $arrayToObject: "$categorie" }
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$categorieObj", { _id: "$_id" }]
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(speseTrimestrali);
  } catch (error) {
    console.error('Errore nel recupero delle spese trimestrali:', error);
    res.status(500).json({ messaggio: error.message });
  }
});

// GET /spese/annuali: ritorna le spese annuali dell'utente
router.get("/annuali", async (req, res) => {
  try {
    const speseAnnuali = await Spesa.aggregate([
      { $match: { utente: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $group: {
          _id: {
            anno: { $year: "$data" },
            categoria: "$categoria"
          },
          totale: { $sum: "$importo" }
        }
      },
      {
        $group: {
          _id: "$_id.anno",
          categorie: {
            $push: {
              k: "$_id.categoria",
              v: "$totale"
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          categorieObj: { $arrayToObject: "$categorie" }
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$categorieObj", { _id: "$_id" }]
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(speseAnnuali);
  } catch (error) {
    console.error('Errore nel recupero delle spese annuali:', error);
    res.status(500).json({ messaggio: error.message });
  }
});

// GET /spese/per-categoria: ritorna le spese per categoria dell'utente
router.get("/per-categoria", async (req, res) => {
  try {
    const spesePerCategoria = await Spesa.aggregate([
      { $match: { utente: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $group: {
          _id: "$categoria",
          totale: { $sum: "$importo" }
        }
      },
      { $sort: { totale: -1 } }
    ]);
    res.json(spesePerCategoria);
  } catch (error) {
    console.error('Errore nel recupero delle spese per categoria:', error);
    res.status(500).json({ messaggio: error.message });
  }
});

// GET /spese/categorie: ritorna le categorie di spesa dell'utente
router.get("/categorie", async (req, res) => {
  try {
    const categorie = await Spesa.distinct("categoria", { utente: req.user._id });
    res.json(categorie);
  } catch (error) {
    console.error('Errore nel recupero delle categorie:', error);
    res.status(500).json({ messaggio: error.message });
  }
});

// GET /spese/riepilogo: ritorna un riepilogo delle spese dell'utente
router.get("/riepilogo", async (req, res) => {
  try {
    const riepilogo = await Spesa.aggregate([
      { $match: { utente: new mongoose.Types.ObjectId(req.user._id) } },
      { $group: { _id: "$categoria", totale: { $sum: "$importo" } } }
    ]);
    res.json(riepilogo);
  } catch (error) {
    console.error('Errore nel recupero del riepilogo:', error);
    res.status(500).json({ messaggio: error.message });
  }
});

// POST /spese: crea una nuova spesa
router.post("/", cloudinaryUploader.single("ricevuta"), async (req, res) => {
  try {
    const { importo, categoria, descrizione, data } = req.body;
    const nuovaSpesa = new Spesa({
      utente: req.user._id,
      importo,
      categoria,
      descrizione,
      data,
      urlRicevuta: req.file ? req.file.path : undefined
    });
    await nuovaSpesa.save();
    res.status(201).json(nuovaSpesa);
  } catch (error) {
    console.error('Errore nella creazione della spesa:', error);
    res.status(400).json({ messaggio: error.message });
  }
});

// GET /spese/:id: ritorna una singola spesa
router.get("/:id", async (req, res) => {
  try {
    const spesa = await Spesa.findOne({ _id: req.params.id, utente: req.user._id });
    if (!spesa) {
      return res.status(404).json({ messaggio: "Spesa non trovata" });
    }
    res.json(spesa);
  } catch (error) {
    console.error('Errore nel recupero della spesa:', error);
    res.status(500).json({ messaggio: error.message });
  }
});

// PUT /spese/:id: aggiorna una spesa esistente
router.put("/:id", cloudinaryUploader.single("ricevuta"), async (req, res) => {
  try {
    const { importo, categoria, descrizione, data } = req.body;
    const updateData = { importo, categoria, descrizione, data };
    if (req.file) {
      updateData.urlRicevuta = req.file.path;
    }
    const spesaAggiornata = await Spesa.findOneAndUpdate(
      { _id: req.params.id, utente: req.user._id },
      updateData,
      { new: true }
    );
    if (!spesaAggiornata) {
      return res.status(404).json({ messaggio: "Spesa non trovata" });
    }
    res.json(spesaAggiornata);
  } catch (error) {
    console.error('Errore nell\'aggiornamento della spesa:', error);
    res.status(400).json({ messaggio: error.message });
  }
});

// DELETE /spese/:id: elimina una spesa
router.delete("/:id", async (req, res) => {
  try {
    const spesaEliminata = await Spesa.findOneAndDelete({ _id: req.params.id, utente: req.user._id });
    if (!spesaEliminata) {
      return res.status(404).json({ messaggio: "Spesa non trovata" });
    }
    res.json({ messaggio: "Spesa eliminata con successo" });
  } catch (error) {
    console.error('Errore nell\'eliminazione della spesa:', error);
    res.status(500).json({ messaggio: error.message });
  }
});

// GET /spese/ricerca: cerca spese per descrizione o categoria
router.get("/ricerca", async (req, res) => {
  try {
    const { query } = req.query;
    const spese = await Spesa.find({
      utente: req.user._id,
      $or: [
        { descrizione: { $regex: query, $options: 'i' } },
        { categoria: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(spese);
  } catch (error) {
    console.error('Errore nella ricerca delle spese:', error);
    res.status(500).json({ messaggio: error.message });
  }
});

export default router;