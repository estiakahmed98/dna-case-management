import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        include: {
          role: true
        },
        orderBy: { user_id: 'desc' }
      });
      res.json(users);
    } catch (error) {
      console.error('Users API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { name, email, password, role_id, two_factor_enabled } = req.body;
      
      // Hash password
      const password_hash = await bcrypt.hash(password, 12);
      
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password_hash,
          role_id,
          two_factor_enabled
        },
        include: {
          role: true
        }
      });
      
      res.status(201).json(user);
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
