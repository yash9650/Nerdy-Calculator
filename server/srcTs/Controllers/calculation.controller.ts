import { Request, Response } from "express";
import { CalculationEntity } from "../Database/Entities/calculation.entity";
import appDataSource from "../Database/DataSource";
import { errorResponse, successResponse } from "../Utils/request.utils";

export class CalculationController {
  static async getAllUserCalculations(req: Request, res: Response) {
    const calculationRepo = appDataSource.getRepository(CalculationEntity);
    const calculations = await calculationRepo.find({
      where: {
        userId: req.user?.id,
      },
    });

    return successResponse<CalculationEntity[]>(res, calculations);
  }

  static async createCalculation(req: Request, res: Response) {
    const calculationRepo = appDataSource.getRepository(CalculationEntity);
    const { calculation, name, result } = req.body;

    if (!calculation || !name || !result) {
      return errorResponse(res, "Invalid data");
    }

    const newCalculation = new CalculationEntity();
    newCalculation.calculation = calculation;
    newCalculation.name = name;
    newCalculation.result = result;

    if (req.user?.id) {
      newCalculation.userId = req.user.id;
    }

    try {
      const savedCalculation = await calculationRepo.save(newCalculation);
      return successResponse(res, savedCalculation);
    } catch (error) {
      return errorResponse(res, error?.message || "Unable to save calculation");
    }
  }

  static async deleteCalculationById(req: Request, res: Response) {
    const calculationRepo = appDataSource.getRepository(CalculationEntity);
    const { id } = req.body;

    if (!id) {
      return errorResponse(res, "Invalid data");
    }

    try {
      await calculationRepo.delete({
        id,
        userId: req.user?.id,
      });
      return successResponse(res, "Calculation deleted");
    } catch (error) {
      return errorResponse(
        res,
        error?.message || "Unable to delete calculation"
      );
    }
  }
}
