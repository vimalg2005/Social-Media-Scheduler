import { Request, Response } from "express";
import { publishScheduledPosts } from "../services/schedulerService.js";

/**
 * Triggers the automated post publishing cycle.
 * Secured via Vercel's CRON_SECRET token when running on Vercel.
 */
export const triggerCronPublish = async (req: Request, res: Response): Promise<void> => {
    try {
        // Secure route if running on Vercel by validating the Vercel Cron Secret header
        if (process.env.VERCEL) {
            const authHeader = req.headers.authorization;
            if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
                res.status(401).json({ error: "Unauthorized Cron Request" });
                return;
            }
        }

        console.log("Vercel Cron trigger called. Starting publication check...");
        const count = await publishScheduledPosts();
        
        res.status(200).json({ 
            success: true, 
            message: `Vercel Cron job executed.`, 
            processedCount: count 
        });
    } catch (error: any) {
        console.error("Error in Vercel cron trigger:", error);
        res.status(500).json({ 
            success: false, 
            error: error?.message || "Internal Server Error" 
        });
    }
}
