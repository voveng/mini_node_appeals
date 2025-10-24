import Appeal from "@models/appeal.model.js";
import { Op, fn, col, WhereOptions } from "sequelize";

interface DateFilters {
  createdAt?: {
    [Op.eq]?: Date;
    [Op.between]?: [Date, Date];
  };
}

class AppealService {
  async getStartedAppeals() {
    const appeals = await Appeal.findAll({
      where: { status: "New" },
    });
    return appeals;
  }
  async createAppeal(theme: string, message: string) {
    const appeal = await Appeal.create({ theme, message });
    return appeal;
  }

  async startProcessing(id: number) {
    const appeal = await Appeal.findByPk(id);
    if (!appeal) {
      throw new Error("Appeal not found");
    }
    appeal.status = "InProgress";
    await appeal.save();
    return appeal;
  }

  async completeAppeal(id: number, solution: string) {
    const appeal = await Appeal.findByPk(id);
    if (!appeal) {
      throw new Error("Appeal not found");
    }
    appeal.status = "Completed";
    appeal.solution = solution;
    await appeal.save();
    return appeal;
  }

  async cancelAppeal(id: number, reason: string) {
    const appeal = await Appeal.findByPk(id);
    if (!appeal) {
      throw new Error("Appeal not found");
    }
    appeal.status = "Cancelled";
    appeal.cancelReason = reason;
    await appeal.save();
    return appeal;
  }

  async cancelAllInProgress() {
    const appeals = await Appeal.findAll({
      where: { status: "InProgress" },
    });
    for (const appeal of appeals) {
      const date = new Date(Date.now());
      appeal.status = "Cancelled";
      appeal.cancelReason = `Cancelled by system appeal_id: ${appeal.id}, at ${date}`;
      await appeal.save();
    }
    return appeals;
  }

  async getAppealsByDates(date?: string, startDate?: string, endDate?: string) {
    const filters: WhereOptions<Appeal> = {};
    if (date) {
      Object.assign(filters, this.filterByDate(date));
    }
    if (startDate && endDate) {
      Object.assign(filters, this.filterByDateRange(startDate, endDate));
    }
    return await Appeal.findAll({ where: filters });
  }

  async filterByDate(date: string) {
    return {
      createdAt: {
        [Op.eq]: new Date(date),
      },
    };
  }

  async filterByDateRange(startDate: string, endDate: string) {
    return {
      createdAt: {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      },
    };
  }
}

export default AppealService;
