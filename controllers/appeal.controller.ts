import { Request, Response } from "express";
import AppealService from "../services/appeal.service";

class AppealController {
  private appealService: AppealService;

  constructor() {
    this.appealService = new AppealService();
  }

  getStartedAppeals = async (req: Request, res: Response) => {
    const appeals = await this.appealService.getStartedAppeals();
    res.json(appeals);
  };

  createAppeal = async (req: Request, res: Response) => {
    const { theme, message } = req.body;
    try {
      const appeal = await this.appealService.createAppeal(theme, message);
      res.status(201).json(appeal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка при создании обращения" });
    }
  };

  startProcessing = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const appeal = await this.appealService.startProcessing(Number(id));
      res.json(appeal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка при обработке обращения" });
    }
  };

  completeAppeal = async (req: Request, res: Response) => {
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

  cancelAppeal = async (req: Request, res: Response) => {
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

  cancelAllInProgress = async (req: Request, res: Response) => {
    try {
      const appeals = await this.appealService.cancelAllInProgress();
      res.json(appeals);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка при отмене обращений" });
    }
  };

  getAppealsByDates = async (req: Request, res: Response) => {
    const { date, startDate, endDate } = req.body;
    try {
      const filters: any = {};

      if (date) {
        Object.assign(
          filters,
          await this.appealService.filterByDate(date as string),
        );
      }

      if (startDate && endDate) {
        Object.assign(
          filters,
          await this.appealService.filterByDateRange(
            startDate as string,
            endDate as string,
          ),
        );
      }

      const appeals = await this.appealService.getAppealsByDates(filters);
      res.json(appeals);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка при получении обращений" });
    }
  };
}

export default new AppealController();

