import { Request, Response, RequestHandler } from "express";
import AppealService from "@services/appeal.service.js";
import { z } from "zod";
import logger from "../utils/logger.js";

const createAppealSchema = z.object({
  theme: z.string().min(2, "Theme cannot be empty"),
  message: z.string().min(2, "Message cannot be empty"),
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
      logger.info(`Appeal created successfully: ${appeal.id}`);
      res.status(201).json(appeal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.issues });
      } else {
        logger.error(error);
        res.status(500).json({ message: "Ошибка при создании обращения" });
      }
    }
  };

  startProcessing: RequestHandler = async (req, res) => {
    const { id } = req.params;
    try {
      const appeal = await this.appealService.startProcessing(Number(id));
      logger.info(`Appeal ${id} started processing successfully.`);
      res.json(appeal);
    } catch (error) {
      logger.error(error);
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
      logger.info(`Appeal ${id} completed successfully.`);
      res.json(appeal);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Ошибка при завершении обращения" });
    }
  };

  cancelAppeal: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    try {
      const appeal = await this.appealService.cancelAppeal(Number(id), reason);
      logger.info(`Appeal ${id} cancelled successfully.`);
      res.json(appeal);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Ошибка при отмене обращения" });
    }
  };

  cancelAllInProgress: RequestHandler = async (req, res) => {
    try {
      const appeals = await this.appealService.cancelAllInProgress();
      logger.info(`Cancelled ${appeals.length} in-progress appeals.`);
      res.json(appeals);
    } catch (error) {
      logger.error(error);
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
      logger.info(`Successfully retrieved appeals by dates. Found ${appeals.length} appeals.`);
      res.json(appeals);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Ошибка при получении обращений" });
    }
  };
}

export default AppealController;
