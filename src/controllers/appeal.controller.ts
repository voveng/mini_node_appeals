import { Request, Response, RequestHandler } from "express";
import AppealService from "@services/appeal.service.js";
import { z } from "zod";

const createAppealSchema = z.object({
  theme: z.string(),
  message: z.string(),
});

class AppealController {
  private appealService: AppealService;

  constructor() {
    this.appealService = new AppealService();
    this.getStartedAppeals = this.getStartedAppeals.bind(this);
    this.createAppeal = this.createAppeal.bind(this);
    this.startProcessing = this.startProcessing.bind(this);
    this.completeAppeal = this.completeAppeal.bind(this);
    this.cancelAppeal = this.cancelAppeal.bind(this);
    this.cancelAllInProgress = this.cancelAllInProgress.bind(this);
    this.getAppealsByDates = this.getAppealsByDates.bind(this);
  }

  getStartedAppeals: RequestHandler = async (req, res) => {
    const appeals = await this.appealService.getStartedAppeals();
    res.json(appeals);
  };

  createAppeal: RequestHandler = async (req, res) => {
    try {
      const { theme, message } = createAppealSchema.parse(req.body);
      const appeal = await this.appealService.createAppeal(theme, message);
      res.status(201).json(appeal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.issues });
      } else {
        console.error(error);
        res.status(500).json({ message: "Ошибка при создании обращения" });
      }
    }
  };

  startProcessing: RequestHandler = async (req, res) => {
    const { id } = req.params;
    try {
      const appeal = await this.appealService.startProcessing(Number(id));
      res.json(appeal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка при обработке обращения" });
    }
  };

  completeAppeal: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { solution } = req.body;
    try {
      const appeal = await this.appealService.completeAppeal(
        Number(id),
        solution,
      );
      res.json(appeal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка при завершении обращения" });
    }
  };

  cancelAppeal: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    try {
      const appeal = await this.appealService.cancelAppeal(Number(id), reason);
      res.json(appeal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка при отмене обращения" });
    }
  };

  cancelAllInProgress: RequestHandler = async (req, res) => {
    try {
      const appeals = await this.appealService.cancelAllInProgress();
      res.json(appeals);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка при отмене обращений" });
    }
  };

  getAppealsByDates: RequestHandler = async (req, res) => {
    const { date, startDate, endDate } = req.body;
    try {
      const appeals = await this.appealService.getAppealsByDates(
        date,
        startDate,
        endDate,
      );
      res.json(appeals);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка при получении обращений" });
    }
  };
}

export default AppealController;