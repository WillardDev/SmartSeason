<?php
namespace Database\Seeders;

use App\Models\Field;
use App\Models\FieldUpdate;
use App\Models\User;
use Illuminate\Database\Seeder;

class FieldSeeder extends Seeder
{
    public function run(): void
    {
        $jane  = User::where('email', 'jane@smartseason.test')->first();
        $brian = User::where('email', 'brian@smartseason.test')->first();
        $amina = User::where('email', 'amina@smartseason.test')->first();

        $fields = [
            [
                'name'              => 'North Plot A',
                'crop_type'         => 'Maize',
                'planting_date'     => now()->subDays(95),
                'stage'             => 'Growing',
                'assigned_agent_id' => $jane->id,
                'updates'           => [
                    ['stage' => 'Planted',  'notes' => 'Seeds planted, soil well prepared.',          'days_ago' => 95, 'agent' => $jane],
                    ['stage' => 'Growing',  'notes' => 'Germination confirmed, fertiliser applied.',  'days_ago' => 60, 'agent' => $jane],
                ],
            ],
            [
                'name'              => 'North Plot B',
                'crop_type'         => 'Maize',
                'planting_date'     => now()->subDays(30),
                'stage'             => 'Growing',
                'assigned_agent_id' => $jane->id,
                'updates'           => [
                    ['stage' => 'Planted', 'notes' => 'Planted alongside North Plot A rotation.',     'days_ago' => 30, 'agent' => $jane],
                    ['stage' => 'Growing', 'notes' => 'Good growth rate, no pests observed.',         'days_ago' => 10, 'agent' => $jane],
                ],
            ],
            [
                'name'              => 'Greenhouse 1',
                'crop_type'         => 'Tomatoes',
                'planting_date'     => now()->subDays(55),
                'stage'             => 'Ready',
                'assigned_agent_id' => $jane->id,
                'updates'           => [
                    ['stage' => 'Planted',  'notes' => 'Seedlings transplanted into greenhouse.',    'days_ago' => 55, 'agent' => $jane],
                    ['stage' => 'Growing',  'notes' => 'Flowering started, irrigation adjusted.',    'days_ago' => 30, 'agent' => $jane],
                    ['stage' => 'Ready',    'notes' => 'Fruits ripening, ready for first harvest.',  'days_ago' => 5,  'agent' => $jane],
                ],
            ],

            [
                'name'              => 'East Valley Field',
                'crop_type'         => 'Wheat',
                'planting_date'     => now()->subDays(110),
                'stage'             => 'Growing',
                'assigned_agent_id' => $brian->id,
                'updates'           => [
                    ['stage' => 'Planted',  'notes' => 'Broadcast seeding done.',                   'days_ago' => 110, 'agent' => $brian],
                    ['stage' => 'Growing',  'notes' => 'Slow growth, drought conditions noted.',    'days_ago' => 45,  'agent' => $brian],
                ],
            ],
            [
                'name'              => 'South Paddock',
                'crop_type'         => 'Beans',
                'planting_date'     => now()->subDays(70),
                'stage'             => 'Ready',
                'assigned_agent_id' => $brian->id,
                'updates'           => [
                    ['stage' => 'Planted', 'notes' => 'Direct sow, good moisture levels.',          'days_ago' => 70, 'agent' => $brian],
                    ['stage' => 'Growing', 'notes' => 'Healthy canopy, pods forming.',              'days_ago' => 35, 'agent' => $brian],
                    ['stage' => 'Ready',   'notes' => 'Pods full, harvest window open.',            'days_ago' => 4,  'agent' => $brian],
                ],
            ],
            [
                'name'              => 'River Bank Plot',
                'crop_type'         => 'Sugarcane',
                'planting_date'     => now()->subDays(20),
                'stage'             => 'Planted',
                'assigned_agent_id' => $brian->id,
                'updates'           => [
                    ['stage' => 'Planted', 'notes' => 'Setts planted along river bank rows.',       'days_ago' => 20, 'agent' => $brian],
                ],
            ],

            [
                'name'              => 'Hillside Terrace 1',
                'crop_type'         => 'Potatoes',
                'planting_date'     => now()->subDays(80),
                'stage'             => 'Harvested',
                'assigned_agent_id' => $amina->id,
                'updates'           => [
                    ['stage' => 'Planted',   'notes' => 'Tubers planted on terraced rows.',         'days_ago' => 80, 'agent' => $amina],
                    ['stage' => 'Growing',   'notes' => 'Foliage full, hilling completed.',         'days_ago' => 50, 'agent' => $amina],
                    ['stage' => 'Ready',     'notes' => 'Tops dying back, ready to harvest.',       'days_ago' => 20, 'agent' => $amina],
                    ['stage' => 'Harvested', 'notes' => 'Full harvest complete, 2.4 tonnes yield.', 'days_ago' => 5,  'agent' => $amina],
                ],
            ],
            [
                'name'              => 'Hillside Terrace 2',
                'crop_type'         => 'Kale (Sukuma Wiki)',
                'planting_date'     => now()->subDays(25),
                'stage'             => 'Growing',
                'assigned_agent_id' => $amina->id,
                'updates'           => [
                    ['stage' => 'Planted', 'notes' => 'Transplanted seedlings, spacing 30cm.',     'days_ago' => 25, 'agent' => $amina],
                    ['stage' => 'Growing', 'notes' => 'First leaves harvested, regrowth strong.',  'days_ago' => 8,  'agent' => $amina],
                ],
            ],
            [
                'name'              => 'Demo Plot (Unassigned)',
                'crop_type'         => 'Sorghum',
                'planting_date'     => now()->subDays(15),
                'stage'             => 'Planted',
                'assigned_agent_id' => null,
                'updates'           => [],
            ],
        ];

        foreach ($fields as $data) {
            $updates = $data['updates'];
            unset($data['updates']);

            $field = Field::create($data);

            foreach ($updates as $u) {
                FieldUpdate::create([
                    'field_id'   => $field->id,
                    'agent_id'   => $u['agent']->id,
                    'stage'      => $u['stage'],
                    'notes'      => $u['notes'],
                    'created_at' => now()->subDays($u['days_ago']),
                    'updated_at' => now()->subDays($u['days_ago']),
                ]);
            }
        }
    }
}
