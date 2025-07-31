import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Get overview statistics
      const [
        totalCases,
        totalSamples,
        totalReports,
        totalUsers,
        pendingReturns,
        recentActivity
      ] = await Promise.all([
        prisma.case.count(),
        prisma.dnaSample.count(),
        prisma.report.count(),
        prisma.user.count(),
        
        // Pending returns (checked out items)
        prisma.sampleMovement.count({
          where: {
            action_type: 'CHECK_OUT',
            returned_date: null,
            expected_return_date: {
              lt: new Date()
            }
          }
        }),
        
        // Recent activity (last 7 days)
        prisma.auditTrail.count({
          where: {
            timestamp: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        })
      ]);

      // Get case type distribution
      const caseTypes = await prisma.case.groupBy({
        by: ['case_type'],
        _count: {
          case_id: true
        }
      });

      // Get storage utilization
      const storageUtilization = await prisma.storageLocation.findMany({
        include: {
          _count: {
            select: {
              samples: true,
              reports: true
            }
          }
        }
      });

      // Get monthly trends (last 12 months)
      const last12Months = new Date();
      last12Months.setMonth(last12Months.getMonth() - 12);

      const monthlyTrends = await prisma.dnaSample.groupBy({
        by: ['received_date'],
        _count: {
          sample_id: true
        },
        where: {
          received_date: {
            gte: last12Months
          }
        }
      });

      // Get user activity
      const userActivity = await prisma.user.findMany({
        include: {
          _count: {
            select: {
              samples: true,
              reports: true,
              auditTrails: true
            }
          }
        }
      });

      const analytics = {
        overview: {
          totalCases,
          totalSamples,
          totalReports,
          totalUsers,
          pendingReturns,
          recentActivity
        },
        caseTypes: caseTypes.map(ct => ({
          type: ct.case_type,
          count: ct._count.case_id
        })),
        storageUtilization: storageUtilization.map(loc => ({
          location: `${loc.type} ${loc.cabinet || ''} ${loc.rack || ''} ${loc.shelf || ''}`.trim(),
          samples: loc._count.samples,
          reports: loc._count.reports,
          total: loc._count.samples + loc._count.reports
        })),
        monthlyTrends,
        userActivity: userActivity.map(user => ({
          name: user.name,
          samples: user._count.samples,
          reports: user._count.reports,
          activities: user._count.auditTrails
        }))
      };

      res.json(analytics);
    } catch (error) {
      console.error('Analytics API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
