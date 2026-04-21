<?php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'     => 'Admin User',
            'email'    => 'admin@smartseason.test',
            'password' => 'smarts3@son', // Plain password for testing
            'role'     => 'admin',
        ]);

        User::create([
            'name'     => 'Field Agent',
            'email'    => 'agent@smartseason.test',
            'password' => 'smarts3@son', // Plain password for testing
            'role'     => 'agent',
        ]);

        User::create([
            'name'     => 'Jane Mwangi',
            'email'    => 'jane@smartseason.test',
            'password' => Hash::make('password'),
            'role'     => 'agent',
        ]);

        User::create([
            'name'     => 'Brian Otieno',
            'email'    => 'brian@smartseason.test',
            'password' => Hash::make('password'),
            'role'     => 'agent',
        ]);

        User::create([
            'name'     => 'Amina Wanjiru',
            'email'    => 'amina@smartseason.test',
            'password' => Hash::make('password'),
            'role'     => 'agent',
        ]);
    }
}
