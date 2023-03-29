-- init --
SET NAMES utf8;
SET time_zone='+00:00';

-- Users --
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `created_at`, `updated_at`, `role`, `show_video`)
VALUES
    (1,'User A','user.one@beez.link',NOW(),'$2y$13$KGo7Hb7drJRqjknndafkHeepfRsQWGm.UZhwiX6wp.sv.3.tJyaEy',NOW(3),NOW(3),'regular',0),
    (2,'Korisnik B','user.two@beez.link', NOW(),'$2y$13$KGo7Hb7drJRqjknndafkHeepfRsQWGm.UZhwiX6wp.sv.3.tJyaEy',NOW(3),NOW(3),'regular',1),
    (3,'Benutzer C','user.three@beez.link', NOW(),'$2y$13$KGo7Hb7drJRqjknndafkHeepfRsQWGm.UZhwiX6wp.sv.3.tJyaEy',NOW(3),NOW(3),'regular',1),
    (4,'Anonymous','user.four@beez.link', NULL,'$2y$13$KGo7Hb7drJRqjknndafkHeepfRsQWGm.UZhwiX6wp.sv.3.tJyaEy',NOW(3),NOW(3),'regular',1),
    (10,'Administrator','admin@beez.link',NOW(),'$2y$13$KGo7Hb7drJRqjknndafkHeepfRsQWGm.UZhwiX6wp.sv.3.tJyaEy',NOW(3),NOW(3),'admin',0),

    (11,'Waldemar Bonsels','waldemar.b@beez.link',NOW(),'$2y$13$KGo7Hb7drJRqjknndafkHeepfRsQWGm.UZhwiX6wp.sv.3.tJyaEy',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'regular',1);

-- Soft Deleted User --
INSERT INTO `users` (`id`,`name`,`email`, `email_verified_at`, `password`,`created_at`,`updated_at`,`role`,`deleted_at`)
VALUES
    (201,'Deleted User','user.deleted@beez.link',NOW(),'$2y$13$KGo7Hb7drJRqjknndafkHeepfRsQWGm.UZhwiX6wp.sv.3.tJyaEy',NOW(3),NOW(3),'regular',NOW(3));

--

-- Apiaries
INSERT INTO `beez`.`apiaries` (`id`, `name`, `description`, `address`, `latitude`, `longitude`,`area`, `altitude`, `type_of_env`, `flora_type`, `sun_exposure`, `migrate`, `created_at`, `owner_id`)
VALUES
    (1,  'Apiary A.1',          'User A primary apiary',            NULL,                                       35.500963, -82.981699, ST_GEOMFROMGEOJSON("{\"type\":\"Polygon\",\"coordinates\":[[[-82.982086,35.501384],[-82.981445,35.501481],[-82.981184,35.501209],[-82.981219,35.500812],[-82.981956,35.500763],[-82.982443,35.50119],[-82.982086,35.501384]]]}"), 797,     'urban',    '',                                                 'medium',   '1', '1999-12-31', 1),
    (2,  'Apiary A.2',          'User A secondary apiary',          NULL,                                       35.499775, -82.980261, ST_GEOMFROMGEOJSON("{\"type\":\"Polygon\",\"coordinates\":[[[-82.979426,35.501184],[-82.979442,35.499442],[-82.979787,35.498443],[-82.980214,35.498657],[-82.981378,35.498152],[-82.982507,35.49919],[-82.979426,35.501184]]]}"), 810,     'urban',    '',                                                 'medium',   '1', '1999-12-31', 1),
    (3,  'Apiary A.3',          'User A tertiary apiary',           '4085 Diamond Street, Waynesville, NC',     35.491073, -82.988451, ST_GEOMFROMGEOJSON("{\"type\":\"Polygon\",\"coordinates\":[[[-82.988508,35.490883],[-82.988122,35.490762],[-82.988182,35.490665],[-82.988568,35.490781],[-82.988508,35.490883]]]}"), 835,     'urban',    '?',                                                'high',     '1', '2000-01-01', 1),
    (4,  'Apiary A.4',          NULL,                               '',                                         35.498187, -83.006707, ST_GEOMFROMGEOJSON("{\"type\":\"Polygon\",\"coordinates\":[[[-83.006074,35.498181],[-83.006632,35.4979],[-83.007178,35.49789],[-83.007487,35.498385],[-83.007048,35.498744],[-83.006418,35.498763],[-83.006074,35.498181]]]}"), 1000,    'natural',  '?',                                                'high',     '1', '2000-01-01', 1),

    (5,  'Pčelinjak B.1',       'Azil - glavni pčelinjak',          'Košutnjak',                                44.777918, 20.429663, ST_GEOMFROMGEOJSON("{\"type\":\"Polygon\",\"coordinates\":[[[20.429112,44.778771],[20.429623,44.777841],[20.429231,44.777089],[20.429992,44.776962],[20.430932,44.776996],[20.431229,44.777393],[20.430837,44.77801],[20.430492,44.778213],[20.430194,44.778535],[20.43023,44.778712],[20.429112,44.778771]]]}"), 150,      'natural',  'Tilia, Quercus, Carpinus betulus, Taxus baccata',  'medium',   '1', '2020-07-09', 2),
    (6,  'Pčelinjak B.2',       'Azil - rezervni pčelinjak',        'Košutnjak',                                44.757297, 20.439965, ST_GEOMFROMGEOJSON("{\"type\":\"Polygon\",\"coordinates\":[[[20.439755,44.758095],[20.439886,44.757376],[20.439755,44.756928],[20.440433,44.757198],[20.440683,44.757232],[20.440945,44.75719],[20.441896,44.75763],[20.441361,44.757723],[20.441147,44.757943],[20.44035,44.75818],[20.439755,44.758095]]]}"), 90,       'natural',  'Tilia, Quercus, Castanea sativa, Corylus colurna', 'low',      '1', '2020-07-10', 2),

    (7,  'Bienenhaus C.X',      'Mobiles Verstecktes Bienenhaus',   '?',                                        0, 0, ST_GEOMFROMGEOJSON("{\"type\":\"Polygon\",\"coordinates\":[[[-0.000407,0.000397],[0.000402,0.000444],[0.000413,-0.000329],[-0.000479,-0.0004],[-0.000467,-0.000388],[-0.000407,0.000397]]]}"), 0,                        'other',    NULL,                                               'medium',    0, '1970-01-02', 3),

    (11, 'Native Colony',       'First colony',                     'Wasserfall',                               46.787233, 8.400579, ST_GEOMFROMGEOJSON("{\"type\":\"Polygon\",\"coordinates\":[[[8.400617,46.787213],[8.400403,46.787107],[8.400205,46.787064],[8.400039,46.787133],[8.399836,46.787435],[8.399937,46.787618],[8.400788,46.787663],[8.401127,46.787435],[8.401056,46.787252],[8.400617,46.787213]]]}"), 1850,      'natural',  'Veronica fruticans, Aster alpinus, Hypericum perforatum', 'medium', 1, '1970-08-24', 11),
    (12, 'Brave New Colony',    'Independent colony',               'Engstlensee',                              46.772662, 8.347248, ST_GEOMFROMGEOJSON("{\"type\":\"Polygon\",\"coordinates\":[[[8.346975,46.772817],[8.346844,46.772707],[8.346927,46.772527],[8.347248,46.772527],[8.347605,46.772625],[8.347486,46.772768],[8.34729,46.772886],[8.346975,46.772817]]]}"), 1900,      'urban',    'Aster alpinus, Neottia nidus-avis, Dryas octopetala',     'high',   1, '1975-01-13', 11),
    (13, 'Field',               'Open field',                       'Trübseebach',                              46.796407, 8.383554, ST_GEOMFROMGEOJSON("{\"type\":\"Polygon\",\"coordinates\":[[[8.383335,46.796668],[8.383674,46.796664],[8.383868,46.79657],[8.383856,46.796407],[8.383653,46.796338],[8.383344,46.796334],[8.383172,46.796497],[8.383335,46.796668]]]}"), 1780,      'natural',  'Neottia nidus-avis, Hypericum perforatum',                'high',   1, '1982-06-20', 11);

-- Soft Deleted Apiary --
INSERT INTO `beez`.`apiaries` (`id`, `name`, `description`, `address`, `latitude`, `longitude`,`area`, `altitude`, `type_of_env`, `flora_type`, `sun_exposure`, `migrate`, `created_at`, `owner_id`,`deleted_at`)
VALUES
    (201,  'Deleted Apiary',    'Soft deleted apiary for testing.', 'Cherry Street 22', NULL,   NULL,   ST_GEOMFROMGEOJSON("{\"type\":\"Polygon\",\"coordinates\":[[[-82.98359,35.497401],[-82.983942,35.496025],[-82.985247,35.496213],[-82.985023,35.497115],[-82.984517,35.497387],[-82.984165,35.497457],[-82.98359,35.497401]]]}"), 205,'urban','','medium',   '1', '1999-12-31', 1,NOW(3));

-- Beehives --
INSERT INTO `beez`.`beehives` (`id`, `name`, `description`, `type`, `latitude`, `longitude`, `altitude`, `num_honey_frames`, `num_pollen_frames`, `num_brood_frames`, `num_empty_frames`, `source_of_swarm`, `queen_color`, `installation_date`, `apiary_id`, `owner_id`)
VALUES
    (1, 'BeeHive A.1.1', 'A11', 'Langstroth ', 35.501336, -82.981523, NULL, 4, 3, 2, 1, 'bought', '#62ec5b', '1999-12-31', 1, 1),
    (2, 'BeeHive A.1.2', 'A12', 'Langstroth ', 35.500943, -82.981578, NULL, 4, 3, 2, 1, 'bought', '#62ec5b', '1999-12-31', 1, 1),
    (3, 'BeeHive A.1.3', 'A13', 'Langstroth ', 35.501165, -82.981934, NULL, 4, 3, 2, 1, 'bought', '#62ec5b', '1999-12-31', 1, 1),

    (4, 'BeeHive A.3.1', 'A31', 'Dadan', 35.500319, -82.980160, NULL, 2, 2, 1, 4, 'bought', '#478822', '2000-01-01', 2, 1),
    (5, 'BeeHive A.3.2', 'A32', 'Dadan', 35.499291, -82.980942, NULL, 2, 2, 1, 4, 'bought', NULL, '2000-01-02', 2, 1),

    (7, 'BeeHive A.4.1', 'A41', 'Warré ', 35.498449, -83.006830, NULL, 2, 1, 2, 1, 'bought', '#478822', '2001-02-28', 4, 1),
    (8, 'BeeHive A.4.2', 'desc', 'Warré ', 35.498182, -83.006483, NULL, 2, 1, 2, 1, 'bought', NULL, '2002-02-28', 4, 1),
    (9, 'BeeHive A.4.3', 'desc', 'Warré ', 35.498048, -83.007026, NULL, 2, 1, 2, 1, 'bought', '#f16872', '2003-02-28', 4, 1),

    (6,  'Beehive A.3.3', 'A33 - pozajmljenja', 'Warré', 35.490759, -82.988311, NULL, 2, 1, 1, 0, 'bought', '#767fcd', '2000-01-03', 5, 1),
    (10, 'Košnica Q11', NULL, 'Dadan', 44.778154, 20.429974, NULL, 0, 0, 0, 0, 'bought', '#402fe2', '1982-04-16', 5, 2),
    (11, 'Bienenstock R10', 'središnja rezervna', 'TBH', 0.000000, 0.000000, NULL, 2, 1, 1, 0, 'bought', '#f16872', NULL, 5, 3),
    (12, 'Košnica S09', NULL, 'Dadan', 44.777553, 20.430300, NULL, 2, 1, 1, 0, 'bought', '#402fe2', '1982-04-16', 5, 2),

    (13, 'Košnica A13', '', NULL, 44.757928, 20.440258, NULL, NULL, 2, 3, 4, 'bought', '#478822', '1982-04-16', 6, 2),
    (14, 'Košnica B12', '', NULL, 44.757658, 20.440887, NULL, 1, NULL, 3, 4,  'bought', '#367870', '1982-04-16', 6, 2),
    (15, 'Košnica C11', '', NULL, 44.757397, 20.440032, NULL, 1, 2, NULL, 4,  'bought', '#478822', '1982-04-16', 6, 2),
    (16, 'Košnica D12', '', NULL, 44.757343, 20.440739, NULL, 1, 2, 3, NULL,  'bought', '#367870', '1982-04-16', 6, 2),

    (17, 'BS #1', 'Bienenstock - unten links', '?', 0.000000, 0.000000, NULL, 0, 0, NULL, NULL, 'inherited', NULL, NULL, 7, 3),
    (18, 'BS #2', 'Bienenstock - unten mitte', '?', 0.000000, 0.000000, NULL, 0, 0, NULL, NULL, 'inherited', NULL, NULL, 7, 3),
    (19, 'BS #3', 'Bienenstock - unten rechts', '?', 0.000000, 0.000000, NULL, 0, 0, NULL, NULL, 'inherited', NULL, NULL, 7, 3),
    (20, 'BS #4', 'Bienenstock - mitte/zentrum', '?', 0.000000, 0.000000, NULL, 0, 0, NULL, NULL, 'inherited', NULL, NULL, 7, 3),
    (21, 'BS #5', 'Bienenstock - oben links', '?', 0.000000, 0.000000, NULL, 0, 0, NULL, NULL, 'inherited', NULL, NULL, 7, 3),
    (22, 'BS #6', 'Bienenstock - oben mitte', '?', 0.000000, 0.000000, NULL, 0, 0, NULL, NULL, 'inherited', NULL, NULL, 7, 3),
    (23, 'BS #7', 'Bienenstock - oben rechts', '?', 0.000000, 0.000000, NULL, 0, 0, NULL, NULL, 'inherited', '#000000', NULL, 7, 3),

    (31, 'Cassandra',   'Ms. Cassandra',        'Dome', 46.787539, 8.400646, NULL, NULL, NULL, NULL, NULL, NULL, '#ff0000', '1972-04-16', 11, 11),
    (32, 'Freddy',      '',                     'Skep', 46.787536, 8.400146, NULL, NULL, NULL, NULL, NULL, NULL, '#ffa500', '1978-04-16', 11, 11),
    (33, 'Willi',       'Willi the Bee',        'Skep', 46.787300, 8.400226, NULL, NULL, NULL, NULL, NULL, NULL, '#ffff00', '1973-04-16', 11, 11),
    (34, 'Buzzlina',    '',                     'Skep', 46.787397, 8.400732, NULL, NULL, NULL, NULL, NULL, NULL, '#008000', '1974-04-16', 11, 11),
    (35, 'Crawley',     '',                     'Skep', 46.787304, 8.400524, NULL, NULL, NULL, NULL, NULL, NULL, '#4b0082', '1975-04-16', 11, 11),
    (36, 'Edgar',       '',                     'Skep', 46.787531, 8.400429, NULL, NULL, NULL, NULL, NULL, NULL, '#0000ff', '1976-04-16', 11, 11),
    (37, 'Beatrice',    '',                     'Skep', 46.787296, 8.400884, NULL, NULL, NULL, NULL, NULL, NULL, '#ee82ee', '1977-04-16', 11, 11),

    (41, 'Bosby',       'Miss Bosby',           'Dome', 46.772723, 8.347038, NULL, NULL, NULL, NULL, NULL, NULL, '#000000', '1972-04-16', 12, 11),
    (42, 'Flip',        'Flip the Grasshopper', 'Skep', 46.772741, 8.347383, NULL, NULL, NULL, NULL, NULL, NULL, '#000000', '1978-04-16', 12, 11),
    (43, 'Barry',       '',                     'Skep', 46.772590, 8.347278, NULL, NULL, NULL, NULL, NULL, NULL, '#000000', '1973-04-16', 12, 11),
    (44, 'Kurt',        'Kurt the Beetle',      'Skep', 46.772649, 8.347010, NULL, NULL, NULL, NULL, NULL, NULL, '#000000', '1980-04-16', 12, 11),
    (45, 'Momo',        '',                     'Skep', 46.772590, 8.347054, NULL, NULL, NULL, NULL, NULL, NULL, '#000000', '1981-04-16', 12, 11);

-- Soft Deleted Beehive --
INSERT INTO `beez`.`beehives` (`id`, `name`, `description`, `type`, `latitude`, `longitude`, `altitude`, `num_honey_frames`, `num_pollen_frames`, `num_brood_frames`, `num_empty_frames`, `source_of_swarm`, `queen_color`, `installation_date`, `apiary_id`, `owner_id`,`deleted_at`)
VALUES
    (201, 'Deleted Beehive', 'Soft deleted beehive for testing', 'Langstroth ', 35.496744, -82.984401, NULL, 4, 3, 2, 1, 'bought', '#62ec5b', '1999-12-31', 1, 1,NOW(3));

INSERT INTO `beez`.`beehive_in_apiary` (`apiary_id`, `beehive_id`, `from` , `until`)
VALUES
    (1, 1, '1999-12-31', NULL),
    (1, 2, '1999-12-31', NULL),
    (1, 3, '1999-12-31', NULL),
    (2, 4, '2000-01-01', NULL),
    (2, 5, '2000-01-02', NULL),
    (2, 6, '2000-01-03', '2020-07-09'),
    (5, 6, '2020-07-09', NULL),
    (4, 7, '2001-02-28', NULL),
    (4, 8, '2002-02-28', NULL),
    (4, 9, '2003-02-28', NULL),
    (5, 10, '1982-04-16', NULL),
    (5, 12, '1982-04-16', NULL),
    (6, 13, '1982-04-16', NULL),
    (6, 14, '1982-04-16', NULL),
    (6, 15, '1982-04-16', NULL),
    (6, 16, '1982-04-16', NULL),
    (11, 31, '1972-04-16', NULL),
    (11, 32, '1978-04-16', NULL),
    (11, 33, '1973-04-16', NULL),
    (11, 34, '1974-04-16', NULL),
    (11, 35, '1975-04-16', NULL),
    (11, 36, '1976-04-16', '1988-08-08'),
    (11, 36, '1988-08-08', '2000-12-12'),
    (11, 36, '2000-12-12', NULL),
    (11, 37, '1977-04-16', NULL),
    (12, 41, '1972-04-16', '1975-01-13'),
    (12, 41, '1975-01-13', NULL),
    (12, 42, '1978-04-16', '1985-02-11'),
    (12, 42, '1985-02-11', NULL),
    (12, 43, '1973-04-16', '1976-04-16'),
    (12, 43, '1976-04-16', '1977-04-16'),
    (12, 43, '1977-04-16', '1978-04-16'),
    (12, 43, '1978-04-16', NULL),
    (12, 44, '1980-04-16', '1983-03-01'),
    (12, 44, '1983-03-01', NULL),
    (12, 45, '1981-04-16', '1983-03-01'),
    (12, 45, '1983-03-01', NULL);


-- Nodes (simulation - user.one)
INSERT INTO `beez`.`nodes` (`id`, `description`, `beehive_id`, `installed_date`)
VALUES
    ('sim-01', 'A.1.1 node',              1, '1999-12-31'),
    ('sim-02', 'A.1.2 node',              2, '1999-12-31'),
    ('sim-03', 'A.1.3 node',              3, '1999-12-31'),
    ('sim-07', 'A.4.1 node',              7, '2001-02-28'),
    ('sim-08', 'A.4.2 node',              8, '2002-02-28'),
    ('sim-09', 'A.4.3 node',              9, '2003-02-28');

-- Nodes (simulation - user.two/Kosutnjak (+user.one +user.three))
INSERT INTO `beez`.`nodes` (`id`, `description`, `beehive_id`, `installed_date`)
VALUES
    ('sim-06', 'Node / Beehive A.3.3',    6, '2000-01-03'),
    ('sim-10', 'Node / Košnica Q11',     10, '1982-04-16'),
    ('sim-11', 'Node / Bienenstock R10', 11, NOW()),
    ('sim-12', 'Node / Košnica S09',     12, '1982-04-16');

-- Nodes (test nodes - user.two / Kosutnjak (rezervni) HW (LoRaWAN))
INSERT INTO `beez`.`nodes` (`id`, `description`, `claim_key`, `hw_version`, `fw_version`, `installed_date`,`claimed_date`, `beehive_id`)
VALUES
    ('tst-00', 'Hexe / LoRaWAN node in 3D printed Beehive @ Regenbogen', UPPER(SUBSTRING(MD5(UUID()),1,16)), 'LoRa32u4 v1.2', '2.1.0',   NOW(), NOW(), 13);
   
-- Nodes (test nodes)
INSERT INTO `beez`.`nodes` (`id`, `description`, `claim_key`, `serial_number`, `hw_version`, `fw_version`, `beehive_id`, `installed_date`)
VALUES
    ('tst-01', 'Node / Cassandra (Hänsel / LoRa, random)',    '6129981B578A25E6', NULL, 'LoRa32u4 v1.2', '2.0/rnd', 31, CURDATE()),
    ('tst-E0AB6917', 'Node / Freddy',    '1CEFFC3D15CE36EA', 'RS18004', '0.8', '0.1', 32, DATE_SUB(CURDATE(), INTERVAL 1 YEAR)),
    ('tst-3EEA0DAF', 'Node / Willi',     '370395B499F8A1F2', 'RS18005', '0.8', '0.1', 33, DATE_SUB(CURDATE(), INTERVAL 1 YEAR)),
    ('tst-1541B162', 'Node / Buzzlina',  '6129981B578A25E6', 'RS18007', '0.8', '0.2', NULL, DATE_SUB(CURDATE(), INTERVAL 1 YEAR)),
    (CONCAT('tst-',UPPER(SUBSTRING(MD5(UUID()),1,8))), 'Node / Crawley', UPPER(SUBSTRING(MD5(UUID()),1,16)), 'RS10008', '0.8', '0.2', NULL, NULL),
    ('tst-02', 'Node / Bosby (Gretel / LoRa, random , dead)', '785EF5478D40731A', NULL, 'LoRa32u4 v1.2', '2.0/rnd', 41,  DATE_SUB(CURDATE(), INTERVAL 1 YEAR)),
    ('tst-BD0CE2B5', 'Node / Flip',      'B76703449AC4DA43', 'RS10004', '0.9', '0.3', 42, DATE_SUB(CURDATE(), INTERVAL 1 YEAR)),
    ('tst-E62C91FD', 'Node / Barry',     '785EF5478D40731A', 'RS10005', '0.9', '0.3', NULL, DATE_SUB(CURDATE(), INTERVAL 1 YEAR)),
    (CONCAT('tst-',UPPER(SUBSTRING(MD5(UUID()),1,8))), 'Node / Kurt',    UPPER(SUBSTRING(MD5(UUID()),1,16)), 'RS10006', '0.9', '0.3', NULL, NULL);

--

SET @year_previous = CAST((YEAR(NOW())-1) AS CHAR(4));
SET @year_now = CAST(YEAR(NOW()) AS CHAR(4));
SET @year_next = CAST((YEAR(NOW())+1) AS CHAR(4));


-- Maintenance Templates - plans --
-- INSERT INTO `beez`.`plans` (`id`, `title`, `description`, `start_date`, `stop_date`, `user_id`)
-- VALUES

-- Maintenance Templates - operations --
INSERT INTO `beez`.`operations` (`id`, `name`, `description`, `planning_comments`, `type`, `user_id`, `plan_id`, `beehive_id`, `apiary_id`, `template`)
VALUES
    (11, 'Beehive Inspection and Investigation of the stress', NULL, 'Cause of stress in the hive is not immediately or easily discerned by observation, an inspection of the beehive is in order. It allows you to find out the cause of stress in the beehive so that you properly address it. Your failure in finding out the true cause of stress causes you to address the wrong problem, and insufficiently dealing with the stress. In the beehive inspection that you carry out, be quick so that you reduce the further aggravation of the bees.',
     'analysis', NULL, NULL, NULL, NULL, 1),
    (12, 'Disease, Pest and Parasite Control', NULL, 'Take quick action to control diseases, pests, or parasites you might find are in the hive. Different diseases are treated using different methods and compounds. Use the most effective and available method at your disposal. Waiting for some solutions to be available at a later time gives the disease time to further hurt the honeybee colony.\n In the same manner, address the pest or parasite problem you find in the beehive. Use the most appropriate, effective, and readily available method.',
     'interventions', NULL, NULL, NULL, NULL, 1),
    (13, 'Honey extraction', 'Crush and drain method', '1. Remove roof and quilt \n 2. Remove boxes of comb from the top of the hive, being sure to leave sufficient stores for the colony to overwinter on. \n 3. Crush the combs. \n 4. Strain the honey \n 5. Process the beeswax.',
     'harvest', NULL, NULL, NULL, NULL, 1),
    (14, 'Honey extraction', 'Centrifugal extraction', '1. Remove hive outer cover from top of the beehive super \n 2. Remove hive inner cover from top super \n 3. If no queen excluder was used, inspect frames for brood and only remove frames that are without brood. \n 4a. Add fume board to top of hive to force bees into lower parts of hive. \n 4b. Repeat steps 3 and 4a until all supers are removed \n 5. Transport frames in supers to honey house \n 6. Heat and dehumidify frames in honey house for 1– 2 days \n 7. Use refractometer to check that moisture content is below 18.5% \n 8. Remove the wax cap on capped honey manually (Uncap) \n 9. Load honey extractor \n 10. Turn on honey extractor motor \n 11. Run extracting process for several minutes \n 12. Remove extracted frames from extractor \n 13. Empty extractor sump: Let collected honey flow into storage container via gravity. \n 14. Filter honey \n 15. Grade honey \n 16. Bottle honey',
     'harvest', NULL, NULL, NULL, NULL, 1),
    (15, 'Labelling', 'Inventory checking', 'Check if the labels are visible, and replace them if not',
     'custom', NULL, NULL, NULL, NULL, 1),

    (21, 'Routine Hive Inspection', NULL, 'Queen Check - Check to see if she’s still in her cage and if she’s been accepted by the colony. \n Brood Pattern - Look at the brood nest to see how your hive is reproducing. Check for different stages of development in the brood nest. \n Signs Of Swarming - Check the frames and see how many are covered with bees. Look to see if the hive is overcrowded or if queen cells are being developed. \n Pollen & Honey - See if your bees are bringing in pollen. Over the summer, check the supers and see is your hive is producing honey. \n Diseases & Pests - Check for any signs of diseases or pests in your hive.', 'analysis', 2, NULL, NULL, NULL, 1),

    (31, 'Frame replacement', NULL, 'Replace frames at a rate of two to four frames per colony per year (about 20 percent per year). Replacement of older, darker comb is easiest during initial spring cleaning of colonies or with removal of deadouts.', 'interventions', 2, NULL, NULL, NULL, 1),
    (32, 'Frame replacement', NULL, 'Replace older frames with thick, dark comb and comb with more than 10 percent drone cells. Such frames in the lower box are often without brood during early spring colony inspection and most likely will contain few cells of pollen or honey.','harvest', 3, NULL, NULL, NULL, 1);
-- Maintenance Templates - plans --
INSERT INTO `beez`.`plans` (`id`, `title`, `description`, `start_date`, `stop_date`, `user_id`, `template`)
VALUES
    (33, 'After Summer Check', 'Instead of opening the hive,test the weight', '2022-09-21', '2022-09-22',  1, 1),
    (34, 'Late Winter/Early Spring', 'Keep apiaries tidy and remove dead out equipment.', '2022-03-10', '2022-03-23',  1, 1),
    (35, 'Spring Buildup', 'Observe for proper spring buildup and feed to stimulate brood.', '2022-03-25', '2022-03-27',  1, 1),
    (36, 'Late Fall Plan', 'Ensure proper nutrition and winterize colonies', '2022-12-05', '2022-12-22',  1, 1);

-- Soft deleted Maintenance Templates - operations --
INSERT INTO `beez`.`operations` (`id`, `name`, `description`, `planning_comments`, `type`, `user_id`, `plan_id`, `beehive_id`, `apiary_id`, `template`,`deleted_at`)
VALUES
    (201, 'Deleted Template - operation','Soft deleted operation template', NULL,'analysis', NULL, NULL, NULL, NULL, 1,NOW(3));

-- Maintenance Plans --
INSERT INTO `beez`.`plans` (`id`, `title`, `description`, `start_date`, `stop_date`, `user_id`)
VALUES
    (1, 'Late Winter to Spring', 'Regular inspection tasks to be repeated every 10 days.', '2021-02-10', '2021-04-24', NULL),
    (2, 'Late Spring to Late Summer', 'Regular inspection tasks to be repeated every 3-4 weeks.', '2021-04-25', '2021-09-11', NULL),
    (3, 'Early Fall to Winter', 'Inspection tasks for wintering preparation', '2021-10-12', '2021-11-24', NULL),

    (5, 'Zimska provera', 'Redovna provera na svakih 10ak dana.', DATE(CONCAT(@year_previous,'-02-10')), DATE(CONCAT(@year_previous,'-04-24')), 2),
    (6, 'Zimska provera', 'Redovna provera na svakih 10ak dana.', DATE(CONCAT(@year_now,'-02-10')), DATE(CONCAT(@year_now,'-04-24')), 2),
    (7, 'Zimska provera', 'Redovna provera na svakih 10ak dana.', DATE(CONCAT(@year_next,'-02-10')), DATE(CONCAT(@year_next,'-04-24')), 2),

    (11, 'Home check', 'Activities in the Native Colony',     DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL  2 DAY), 11),
    (12, 'New land visit', 'What is going on in New Colony',  DATE_ADD(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL  5 DAY), 11),
    (13, 'Get dirty', 'Get dirty and check the honey fields', DATE_ADD(NOW(), INTERVAL 6 DAY), DATE_ADD(NOW(), INTERVAL 16 DAY), 11);

-- Soft deleted Maintenance Plans --
INSERT INTO `beez`.`plans` (`title`, `description`, `start_date`, `stop_date`, `user_id`,`deleted_at`)
VALUES
    ('Deleted plan', 'Soft deleted maintenance plan for testing.', '2021-02-10', '2021-04-24', 1,NOW(3));

-- Maintenance Operations --

-- user 1 / apiary 1
INSERT INTO `beez`.`operations` (`name`, `description`, `type`, `status`, `planning_comments`, `planned_date`, `execution_comments`, `executed_date`,  `user_id`, `plan_id`, `beehive_id`, `apiary_id`)
VALUES
    ('Swarming check', 'Regular inspection tasks to be repeated every 10 days.', 'analysis', 'planned', 'Observe the hive for any signs of swarming (overcrowding or developing queen cells) \n Determine if a hive needs to be split or combined for the upcoming season', '2021-02-10', NULL, NULL, 1, 1, NULL, 1),
    ('Health check & harvesting readiness', 'Regular inspection tasks to be repeated every 3-4 weeks.', 'analysis', 'started', 'Routine hive inspection to determine the health of the hive \n If there is strong honey flow, take longer time between inspections. Begin harvesting honey to allow the bees to produce more', '2021-04-25', NULL, NULL, 1, 1, NULL, 1),
    ('Health check', 'Regular inspection tasks to be repeated every 3-4 weeks.', 'analysis', 'done', 'Routine hive inspection to determine the health of the hive \n If there is strong honey flow, take longer time between inspections. Begin harvesting honey to allow the bees to produce more', '2021-05-23', NULL, NULL, 1, 1, NULL, 1),
    ('Swarming check', 'Regular inspection tasks to be repeated every 10 days.', 'analysis', 'done', 'Observe the hive for any signs of swarming (overcrowding or developing queen cells) \n Determine if a hive needs to be split or combined for the upcoming season', '2021-02-10', NULL, NULL, 1, 1, NULL, 1),

    ('Food check', 'Inspection tasks for wintering preparation', 'analysis', 'canceled', 'Ensure your bees have enough food for the winter.', '2021-10-31', NULL, NULL, 1, 2, NULL, 1),
    ('Health check & harvesting readiness', 'Regular inspection tasks to be repeated every 3-4 weeks.', 'analysis', 'planned', 'Routine hive inspection to determine the health of the hive \n If there is strong honey flow, take longer time between inspections. Begin harvesting honey to allow the bees to produce more', '2021-04-25', NULL, NULL, 1, 2, NULL, 1),
    ('Health check', 'Regular inspection tasks to be repeated every 3-4 weeks.', 'analysis', 'done', 'Routine hive inspection to determine the health of the hive \n If there is strong honey flow, take longer time between inspections. Begin harvesting honey to allow the bees to produce more', '2021-05-23', NULL, NULL, 1, 2, NULL, 1),
    ('Swarming check', 'Regular inspection tasks to be repeated every 10 days.', 'analysis', 'done', 'Observe the hive for any signs of swarming (overcrowding or developing queen cells) \n Determine if a hive needs to be split or combined for the upcoming season', '2021-02-10', NULL, NULL, 1, 2, NULL, 1),
    ('Food check', 'Inspection tasks for wintering preparation', 'analysis', 'canceled', 'Ensure your bees have enough food for the winter.', '2021-10-31', NULL, NULL, 1, 2, NULL, 1),

    ('Food check', 'Inspection tasks for wintering preparation', 'analysis', 'canceled', 'Ensure your bees have enough food for the winter.', '2021-10-31', NULL, NULL, 1, 3, NULL, 1);

-- user 1 / apiary 2
INSERT INTO `beez`.`operations` (`name`, `description`, `type`, `status`, `planning_comments`, `planned_date`, `execution_comments`, `executed_date`,  `user_id`, `plan_id`, `beehive_id`, `apiary_id`)
VALUES
    ('Health check & harvesting readiness', 'Regular inspection tasks to be repeated every 3-4 weeks.', 'analysis', 'planned', 'Routine hive inspection to determine the health of the hive \n If there is strong honey flow, take longer time between inspections. Begin harvesting honey to allow the bees to produce more', '2021-04-25', NULL, NULL, 1, NULL, NULL, 2),
    ('Health check', 'Regular inspection tasks to be repeated every 3-4 weeks.', 'analysis', 'done', 'Routine hive inspection to determine the health of the hive \n If there is strong honey flow, take longer time between inspections. Begin harvesting honey to allow the bees to produce more', '2021-05-23', NULL, NULL, 1, NULL, NULL, 2),
    ('Swarming check', 'Regular inspection tasks to be repeated every 10 days.', 'analysis', 'done', 'Observe the hive for any signs of swarming (overcrowding or developing queen cells) \n Determine if a hive needs to be split or combined for the upcoming season', '2021-02-10', NULL, NULL, 1, NULL, NULL, 2),
    ('Food check', 'Inspection tasks for wintering preparation', 'analysis', 'canceled', 'Ensure your bees have enough food for the winter.', '2021-10-31', NULL, NULL, 1, NULL, NULL, 2),

    ('Food check', 'Inspection tasks for wintering preparation', 'analysis', 'canceled', 'Ensure your bees have enough food for the winter.', '2021-10-31', NULL, NULL, 1, NULL, NULL, 2);

-- user 1 / apiary 3
INSERT INTO `beez`.`operations` (`name`, `description`, `type`, `status`, `planning_comments`, `planned_date`, `execution_comments`, `executed_date`,  `user_id`, `plan_id`, `beehive_id`, `apiary_id`)
VALUES
    ('Health check & harvesting readiness', 'Regular inspection tasks to be repeated every 3-4 weeks.', 'analysis', 'planned', 'Routine hive inspection to determine the health of the hive \n If there is strong honey flow, take longer time between inspections. Begin harvesting honey to allow the bees to produce more', '2021-04-25', NULL, NULL, 1, NULL, NULL, 3),
    ('Health check', 'Regular inspection tasks to be repeated every 3-4 weeks.', 'analysis', 'done', 'Routine hive inspection to determine the health of the hive \n If there is strong honey flow, take longer time between inspections. Begin harvesting honey to allow the bees to produce more', '2021-05-23', NULL, NULL, 1, NULL, NULL, 3),
    ('Swarming check', 'Regular inspection tasks to be repeated every 10 days.', 'analysis', 'done', 'Observe the hive for any signs of swarming (overcrowding or developing queen cells) \n Determine if a hive needs to be split or combined for the upcoming season', '2021-02-10', NULL, NULL, 1, NULL, NULL, 3),
    ('Food check', 'Inspection tasks for wintering preparation', 'analysis', 'canceled', 'Ensure your bees have enough food for the winter.', '2021-10-31', NULL, NULL, 1, NULL, NULL, 3);

-- user 1 / apiary 4
INSERT INTO `beez`.`operations` (`name`, `description`, `type`, `status`, `planning_comments`, `planned_date`, `execution_comments`, `executed_date`,  `user_id`, `plan_id`, `beehive_id`, `apiary_id`)
VALUES
    ('Swarming check', 'Regular inspection tasks to be repeated every 10 days.', 'analysis', 'planned', 'Observe the hive for any signs of swarming (overcrowding or developing queen cells) \n Determine if a hive needs to be split or combined for the upcoming season', '2021-02-10', NULL, NULL, 1, NULL, NULL, 4),
    ('Health check & harvesting readiness', 'Regular inspection tasks to be repeated every 3-4 weeks.', 'analysis', 'started', 'Routine hive inspection to determine the health of the hive \n If there is strong honey flow, take longer time between inspections. Begin harvesting honey to allow the bees to produce more', '2021-04-25', NULL, NULL, 1, NULL, NULL, 4),
    ('Health check', 'Regular inspection tasks to be repeated every 3-4 weeks.', 'analysis', 'done', 'Routine hive inspection to determine the health of the hive \n If there is strong honey flow, take longer time between inspections. Begin harvesting honey to allow the bees to produce more', '2021-05-23', NULL, NULL, 1, NULL, NULL, 4),
    ('Swarming check', 'Regular inspection tasks to be repeated every 10 days.', 'analysis', 'done', 'Observe the hive for any signs of swarming (overcrowding or developing queen cells) \n Determine if a hive needs to be split or combined for the upcoming season', '2021-02-10', NULL, NULL, 1, NULL, NULL, 4),
    ('Food check', 'Inspection tasks for wintering preparation', 'analysis', 'canceled', 'Ensure your bees have enough food for the winter.', '2021-10-31', NULL, NULL, 1, NULL, NULL, 4);

-- user 2 / apiary 5 / previous year
INSERT INTO `beez`.`operations` (`name`, `description`, `type`, `status`, `planning_comments`, `planned_date`, `execution_comments`, `executed_date`,  `user_id`, `plan_id`, `beehive_id`, `apiary_id`)
VALUES
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'done',     'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_previous,'-02-10')), 'Sve je u redu.', DATE(CONCAT(@year_previous,'-02-10')), 2, 5, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'done',     'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_previous,'-02-20')), 'U redu.',        DATE(CONCAT(@year_previous,'-02-20')), 2, 5, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'done',     'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_previous,'-03-01')), 'Sve je u redu.', DATE(CONCAT(@year_previous,'-03-01')), 2, 5, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'done',     'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_previous,'-03-11')), 'Sve je u redu.', DATE(CONCAT(@year_previous,'-03-09')), 2, 5, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'canceled', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_previous,'-03-21')), NULL,             NULL,                                  2, 5, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'done',     'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_previous,'-03-31')), 'Sve je u redu.', DATE(CONCAT(@year_previous,'-03-31')), 2, 5, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'done',     'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_previous,'-04-12')), 'Sve je u redu.', DATE(CONCAT(@year_previous,'-04-15')), 2, 5, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'done',     'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_previous,'-04-23')), 'Sve je u redu.', DATE(CONCAT(@year_previous,'-04-24')), 2, 5, NULL, 5);

-- user 2 / apiary 6
INSERT INTO `beez`.`operations` (`name`, `description`, `type`, `status`, `planning_comments`, `planned_date`, `execution_comments`, `executed_date`,  `user_id`, `plan_id`, `beehive_id`, `apiary_id`)
VALUES
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'done',     'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_previous,'-02-13')), 'Sve je u redu.', DATE(CONCAT(@year_previous,'-02-10')), 2, 5, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'canceled', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_previous,'-02-23')), NULL,             NULL,                                  2, 5, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'done',     'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_previous,'-03-04')), 'Sve je u redu.', DATE(CONCAT(@year_previous,'-03-01')), 2, 5, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'done',     'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_previous,'-03-14')), 'Sve je u redu.', DATE(CONCAT(@year_previous,'-03-09')), 2, 5, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'done',     'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_previous,'-03-24')), 'Sve je u redu.', DATE(CONCAT(@year_previous,'-03-21')), 2, 5, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'canceled', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_previous,'-04-04')), NULL,             NULL,                                  2, 5, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'done',     'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_previous,'-04-15')), NULL,             DATE(CONCAT(@year_previous,'-04-15')), 2, 5, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'done',     'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_previous,'-04-27')), NULL,             DATE(CONCAT(@year_previous,'-04-24')), 2, 5, NULL, 6);

-- user 2 / apiary 5 / this year
INSERT INTO `beez`.`operations` (`name`, `description`, `type`, `status`, `planning_comments`, `planned_date`, `execution_comments`, `executed_date`,  `user_id`, `plan_id`, `beehive_id`, `apiary_id`)
VALUES
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'started', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_now,'-02-10')), NULL, NULL, 2, 6, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'started', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_now,'-02-20')), NULL, NULL, 2, 6, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'started', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_now,'-03-01')), NULL, NULL, 2, 6, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'started', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_now,'-03-11')), NULL, NULL, 2, 6, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'started', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_now,'-03-21')), NULL, NULL, 2, 6, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_now,'-03-31')), NULL, NULL, 2, 6, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_now,'-04-12')), NULL, NULL, 2, 6, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_now,'-04-23')), NULL, NULL, 2, 6, NULL, 5);

-- user 2 / apiary 6
INSERT INTO `beez`.`operations` (`name`, `description`, `type`, `status`, `planning_comments`, `planned_date`, `execution_comments`, `executed_date`,  `user_id`, `plan_id`, `beehive_id`, `apiary_id`)
VALUES
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'started',  'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_now,'-02-13')), NULL, NULL, 2, 6, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'canceled', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_now,'-02-23')), NULL, NULL, 2, 6, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'started',  'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_now,'-03-04')), NULL, NULL, 2, 6, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned',  'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_now,'-03-14')), NULL, NULL, 2, 6, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned',  'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_now,'-03-24')), NULL, NULL, 2, 6, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned',  'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_now,'-04-04')), NULL, NULL, 2, 6, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned',  'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_now,'-04-15')), NULL, NULL, 2, 6, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned',  'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_now,'-04-27')), NULL, NULL, 2, 6, NULL, 6);

-- user 2 / apiary 5 / next year
INSERT INTO `beez`.`operations` (`name`, `description`, `type`, `status`, `planning_comments`, `planned_date`, `execution_comments`, `executed_date`,  `user_id`, `plan_id`, `beehive_id`, `apiary_id`)
VALUES
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'canceled', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_next,'-02-10')), NULL, NULL, 2, 7, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_next,'-02-20')), NULL, NULL, 2, 7, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_next,'-03-01')), NULL, NULL, 2, 7, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_next,'-03-11')), NULL, NULL, 2, 7, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_next,'-03-21')), NULL, NULL, 2, 7, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_next,'-03-31')), NULL, NULL, 2, 7, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_next,'-04-12')), NULL, NULL, 2, 7, NULL, 5),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_next,'-04-23')), NULL, NULL, 2, 7, NULL, 5);

-- user 2 / apiary 6
INSERT INTO `beez`.`operations` (`name`, `description`, `type`, `status`, `planning_comments`, `planned_date`, `execution_comments`, `executed_date`,  `user_id`, `plan_id`, `beehive_id`, `apiary_id`)
VALUES
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'canceled', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_next,'-02-13')), NULL, NULL, 2, 7, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_next,'-02-23')), NULL, NULL, 2, 7, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_next,'-03-04')), NULL, NULL, 2, 7, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_next,'-03-14')), NULL, NULL, 2, 7, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_next,'-03-24')), NULL, NULL, 2, 7, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_next,'-04-04')), NULL, NULL, 2, 7, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_next,'-04-15')), NULL, NULL, 2, 7, NULL, 6),
    ('Rojenje ?', 'Redovna provera na svakih 7-10 dana.', 'analysis', 'planned', 'Proveri košnicu na znake rojenja \n Odluči da li košnica treba da se podeli ili spoji u narednoj sezoni', DATE(CONCAT(@year_next,'-04-27')), NULL, NULL, 2, 7, NULL, 6);


-- user 3 / ???
INSERT INTO `beez`.`operations` (`name`, `description`, `type`, `status`, `planning_comments`, `planned_date`, `execution_comments`, `executed_date`,  `user_id`, `plan_id`, `beehive_id`, `apiary_id`)
VALUES
    ('Bienenstockinspektion.', NULL, 'analysis', 'planned', 'Da sich die Ursache für Stress im Bienenstock nicht sofort oder leicht durch Beobachtung feststellen lässt, ist eine Inspektion des Bienenstocks angebracht. Auf diese Weise können Sie die Ursache für den Stress im Bienenstock herausfinden, damit Sie das Problem richtig angehen können. Wenn es Ihnen nicht gelingt, die wahre Ursache des Stresses herauszufinden, gehen Sie das falsche Problem an und gehen unzureichend gegen den Stress vor. Seien Sie bei der Inspektion des Bienenstocks schnell, damit Sie die Bienen nicht weiter belästigen.', DATE_ADD(CURDATE(), INTERVAL 1 DAY), NULL, NULL, 3, NULL, NULL, 7),

    ('Bekämpfung von Krankheiten, Schädlingen und Parasiten.', NULL, 'analysis', 'planned', 'Ergreifen Sie schnell Massnahmen zur Bekämpfung von Krankheiten, Schädlingen oder Parasiten, die sich im Bienenstock befinden. Verschiedene Krankheiten werden mit unterschiedlichen Methoden und Wirkstoffen behandelt. Wenden Sie die wirksamste verfügbare Methode an, die Ihnen zur Verfügung steht. Wenn Sie warten, bis bestimmte Lösungen zu einem späteren Zeitpunkt verfügbar sind, hat die Krankheit Zeit, das Bienenvolk weiter zu schädigen.\n Gehen Sie auf die gleiche Weise mit dem Schädlings- oder Parasitenproblem um, das Sie im Bienenstock finden. Verwenden Sie die geeignetste, wirksamste und am schnellsten verfügbare Methode.', DATE_ADD(CURDATE(), INTERVAL  2 DAY), NULL, NULL, 3, NULL, 17, 7),
    ('Bekämpfung von Krankheiten, Schädlingen und Parasiten.', NULL, 'analysis', 'planned', 'Ergreifen Sie schnell Massnahmen zur Bekämpfung von Krankheiten, Schädlingen oder Parasiten, die sich im Bienenstock befinden. Verschiedene Krankheiten werden mit unterschiedlichen Methoden und Wirkstoffen behandelt. Wenden Sie die wirksamste verfügbare Methode an, die Ihnen zur Verfügung steht. Wenn Sie warten, bis bestimmte Lösungen zu einem späteren Zeitpunkt verfügbar sind, hat die Krankheit Zeit, das Bienenvolk weiter zu schädigen.\n Gehen Sie auf die gleiche Weise mit dem Schädlings- oder Parasitenproblem um, das Sie im Bienenstock finden. Verwenden Sie die geeignetste, wirksamste und am schnellsten verfügbare Methode.', DATE_ADD(CURDATE(), INTERVAL  4 DAY), NULL, NULL, 3, NULL, 18, 7),
    ('Bekämpfung von Krankheiten, Schädlingen und Parasiten.', NULL, 'analysis', 'planned', 'Ergreifen Sie schnell Massnahmen zur Bekämpfung von Krankheiten, Schädlingen oder Parasiten, die sich im Bienenstock befinden. Verschiedene Krankheiten werden mit unterschiedlichen Methoden und Wirkstoffen behandelt. Wenden Sie die wirksamste verfügbare Methode an, die Ihnen zur Verfügung steht. Wenn Sie warten, bis bestimmte Lösungen zu einem späteren Zeitpunkt verfügbar sind, hat die Krankheit Zeit, das Bienenvolk weiter zu schädigen.\n Gehen Sie auf die gleiche Weise mit dem Schädlings- oder Parasitenproblem um, das Sie im Bienenstock finden. Verwenden Sie die geeignetste, wirksamste und am schnellsten verfügbare Methode.', DATE_ADD(CURDATE(), INTERVAL  6 DAY), NULL, NULL, 3, NULL, 19, 7),
    ('Bekämpfung von Krankheiten, Schädlingen und Parasiten.', NULL, 'analysis', 'planned', 'Ergreifen Sie schnell Massnahmen zur Bekämpfung von Krankheiten, Schädlingen oder Parasiten, die sich im Bienenstock befinden. Verschiedene Krankheiten werden mit unterschiedlichen Methoden und Wirkstoffen behandelt. Wenden Sie die wirksamste verfügbare Methode an, die Ihnen zur Verfügung steht. Wenn Sie warten, bis bestimmte Lösungen zu einem späteren Zeitpunkt verfügbar sind, hat die Krankheit Zeit, das Bienenvolk weiter zu schädigen.\n Gehen Sie auf die gleiche Weise mit dem Schädlings- oder Parasitenproblem um, das Sie im Bienenstock finden. Verwenden Sie die geeignetste, wirksamste und am schnellsten verfügbare Methode.', DATE_ADD(CURDATE(), INTERVAL  8 DAY), NULL, NULL, 3, NULL, 20, 7),
    ('Bekämpfung von Krankheiten, Schädlingen und Parasiten.', NULL, 'analysis', 'planned', 'Ergreifen Sie schnell Massnahmen zur Bekämpfung von Krankheiten, Schädlingen oder Parasiten, die sich im Bienenstock befinden. Verschiedene Krankheiten werden mit unterschiedlichen Methoden und Wirkstoffen behandelt. Wenden Sie die wirksamste verfügbare Methode an, die Ihnen zur Verfügung steht. Wenn Sie warten, bis bestimmte Lösungen zu einem späteren Zeitpunkt verfügbar sind, hat die Krankheit Zeit, das Bienenvolk weiter zu schädigen.\n Gehen Sie auf die gleiche Weise mit dem Schädlings- oder Parasitenproblem um, das Sie im Bienenstock finden. Verwenden Sie die geeignetste, wirksamste und am schnellsten verfügbare Methode.', DATE_ADD(CURDATE(), INTERVAL 10 DAY), NULL, NULL, 3, NULL, 21, 7),
    ('Bekämpfung von Krankheiten, Schädlingen und Parasiten.', NULL, 'analysis', 'planned', 'Ergreifen Sie schnell Massnahmen zur Bekämpfung von Krankheiten, Schädlingen oder Parasiten, die sich im Bienenstock befinden. Verschiedene Krankheiten werden mit unterschiedlichen Methoden und Wirkstoffen behandelt. Wenden Sie die wirksamste verfügbare Methode an, die Ihnen zur Verfügung steht. Wenn Sie warten, bis bestimmte Lösungen zu einem späteren Zeitpunkt verfügbar sind, hat die Krankheit Zeit, das Bienenvolk weiter zu schädigen.\n Gehen Sie auf die gleiche Weise mit dem Schädlings- oder Parasitenproblem um, das Sie im Bienenstock finden. Verwenden Sie die geeignetste, wirksamste und am schnellsten verfügbare Methode.', DATE_ADD(CURDATE(), INTERVAL 12 DAY), NULL, NULL, 3, NULL, 22, 7),
    ('Bekämpfung von Krankheiten, Schädlingen und Parasiten.', NULL, 'analysis', 'planned', 'Ergreifen Sie schnell Massnahmen zur Bekämpfung von Krankheiten, Schädlingen oder Parasiten, die sich im Bienenstock befinden. Verschiedene Krankheiten werden mit unterschiedlichen Methoden und Wirkstoffen behandelt. Wenden Sie die wirksamste verfügbare Methode an, die Ihnen zur Verfügung steht. Wenn Sie warten, bis bestimmte Lösungen zu einem späteren Zeitpunkt verfügbar sind, hat die Krankheit Zeit, das Bienenvolk weiter zu schädigen.\n Gehen Sie auf die gleiche Weise mit dem Schädlings- oder Parasitenproblem um, das Sie im Bienenstock finden. Verwenden Sie die geeignetste, wirksamste und am schnellsten verfügbare Methode.', DATE_ADD(CURDATE(), INTERVAL 14 DAY), NULL, NULL, 3, NULL, 23, 7),

    ('Extraktion von Honig', NULL, 'harvest', 'planned', '1. Dach und Steppdecke entfernen \n 2. Entfernen Sie die Wabenkästen von der Oberseite des Bienenstocks und achten Sie darauf, dass genügend Vorräte für die Überwinterung des Bienenvolkes übrig bleiben. \n 3. Die Waben zerdrücken. \n 4. Den Honig abseihen. \n 5. Verarbeite das Bienenwachs.', DATE_ADD(CURDATE(), INTERVAL 1 MONTH), NULL, NULL, 3, NULL, 20, 7),

    ('Extraktion', NULL, 'harvest', 'planned', '1. Entfernen Sie die äussere Abdeckung des Bienenstocks von der Oberseite des Bienenstocks \n 2. Entfernen Sie die innere Abdeckung des Bienenstocks vom oberen Bienenstock \n 3. Wenn kein Königsinnenschutz verwendet wurde, prüfen Sie die Rähmchen auf Brut und entfernen Sie nur die Rähmchen, die ohne Brut sind. \n 4a. Bringen Sie oben im Bienenstock einen Abzug an, um die Bienen in den unteren Teil des Bienenstocks zu zwingen. \n 4b. Wiederholen Sie die Schritte 3 und 4a, bis alle Zargen entfernt sind. \n 5. Die Rähmchen in den Deckeln zum Honigraum transportieren \n 6. Die Rähmchen im Honigraum 1 bis 2 Tage lang erwärmen und entfeuchten \n 7. Mit dem Refraktometer prüfen, ob der Feuchtigkeitsgehalt unter 18,5 % liegt \n 8. Den Wachsdeckel des verdeckten Honigs manuell entfernen (Entdeckeln) \n 9. Honigschleuder beladen \n 10. Motor der Honigschleuder einschalten \n 11. Schleudervorgang mehrere Minuten lang laufen lassen \n 12. Entnehmen Sie die geschleuderten Rähmchen aus der Schleuder \n 13. Den Sumpf der Schleuder entleeren: Den gesammelten Honig durch die Schwerkraft in den Vorratsbehälter fliessen lassen. \n 14. Honig filtern \n 15. Honig sortieren \n 16. Honig abfüllen', DATE_ADD(CURDATE(), INTERVAL 1 MONTH), NULL, NULL, 3, NULL, 17, 7),
    ('Extraktion', NULL, 'harvest', 'planned', '1. Entfernen Sie die äussere Abdeckung des Bienenstocks von der Oberseite des Bienenstocks \n 2. Entfernen Sie die innere Abdeckung des Bienenstocks vom oberen Bienenstock \n 3. Wenn kein Königsinnenschutz verwendet wurde, prüfen Sie die Rähmchen auf Brut und entfernen Sie nur die Rähmchen, die ohne Brut sind. \n 4a. Bringen Sie oben im Bienenstock einen Abzug an, um die Bienen in den unteren Teil des Bienenstocks zu zwingen. \n 4b. Wiederholen Sie die Schritte 3 und 4a, bis alle Zargen entfernt sind. \n 5. Die Rähmchen in den Deckeln zum Honigraum transportieren \n 6. Die Rähmchen im Honigraum 1 bis 2 Tage lang erwärmen und entfeuchten \n 7. Mit dem Refraktometer prüfen, ob der Feuchtigkeitsgehalt unter 18,5 % liegt \n 8. Den Wachsdeckel des verdeckten Honigs manuell entfernen (Entdeckeln) \n 9. Honigschleuder beladen \n 10. Motor der Honigschleuder einschalten \n 11. Schleudervorgang mehrere Minuten lang laufen lassen \n 12. Entnehmen Sie die geschleuderten Rähmchen aus der Schleuder \n 13. Den Sumpf der Schleuder entleeren: Den gesammelten Honig durch die Schwerkraft in den Vorratsbehälter fliessen lassen. \n 14. Honig filtern \n 15. Honig sortieren \n 16. Honig abfüllen', DATE_ADD(CURDATE(), INTERVAL 1 MONTH), NULL, NULL, 3, NULL, 18, 7),
    ('Extraktion', NULL, 'harvest', 'planned', '1. Entfernen Sie die äussere Abdeckung des Bienenstocks von der Oberseite des Bienenstocks \n 2. Entfernen Sie die innere Abdeckung des Bienenstocks vom oberen Bienenstock \n 3. Wenn kein Königsinnenschutz verwendet wurde, prüfen Sie die Rähmchen auf Brut und entfernen Sie nur die Rähmchen, die ohne Brut sind. \n 4a. Bringen Sie oben im Bienenstock einen Abzug an, um die Bienen in den unteren Teil des Bienenstocks zu zwingen. \n 4b. Wiederholen Sie die Schritte 3 und 4a, bis alle Zargen entfernt sind. \n 5. Die Rähmchen in den Deckeln zum Honigraum transportieren \n 6. Die Rähmchen im Honigraum 1 bis 2 Tage lang erwärmen und entfeuchten \n 7. Mit dem Refraktometer prüfen, ob der Feuchtigkeitsgehalt unter 18,5 % liegt \n 8. Den Wachsdeckel des verdeckten Honigs manuell entfernen (Entdeckeln) \n 9. Honigschleuder beladen \n 10. Motor der Honigschleuder einschalten \n 11. Schleudervorgang mehrere Minuten lang laufen lassen \n 12. Entnehmen Sie die geschleuderten Rähmchen aus der Schleuder \n 13. Den Sumpf der Schleuder entleeren: Den gesammelten Honig durch die Schwerkraft in den Vorratsbehälter fliessen lassen. \n 14. Honig filtern \n 15. Honig sortieren \n 16. Honig abfüllen', DATE_ADD(CURDATE(), INTERVAL 1 MONTH), NULL, NULL, 3, NULL, 19, 7),
    ('Extraktion', NULL, 'harvest', 'planned', '1. Entfernen Sie die äussere Abdeckung des Bienenstocks von der Oberseite des Bienenstocks \n 2. Entfernen Sie die innere Abdeckung des Bienenstocks vom oberen Bienenstock \n 3. Wenn kein Königsinnenschutz verwendet wurde, prüfen Sie die Rähmchen auf Brut und entfernen Sie nur die Rähmchen, die ohne Brut sind. \n 4a. Bringen Sie oben im Bienenstock einen Abzug an, um die Bienen in den unteren Teil des Bienenstocks zu zwingen. \n 4b. Wiederholen Sie die Schritte 3 und 4a, bis alle Zargen entfernt sind. \n 5. Die Rähmchen in den Deckeln zum Honigraum transportieren \n 6. Die Rähmchen im Honigraum 1 bis 2 Tage lang erwärmen und entfeuchten \n 7. Mit dem Refraktometer prüfen, ob der Feuchtigkeitsgehalt unter 18,5 % liegt \n 8. Den Wachsdeckel des verdeckten Honigs manuell entfernen (Entdeckeln) \n 9. Honigschleuder beladen \n 10. Motor der Honigschleuder einschalten \n 11. Schleudervorgang mehrere Minuten lang laufen lassen \n 12. Entnehmen Sie die geschleuderten Rähmchen aus der Schleuder \n 13. Den Sumpf der Schleuder entleeren: Den gesammelten Honig durch die Schwerkraft in den Vorratsbehälter fliessen lassen. \n 14. Honig filtern \n 15. Honig sortieren \n 16. Honig abfüllen', DATE_ADD(CURDATE(), INTERVAL 1 MONTH), NULL, NULL, 3, NULL, 21, 7),
    ('Extraktion', NULL, 'harvest', 'planned', '1. Entfernen Sie die äussere Abdeckung des Bienenstocks von der Oberseite des Bienenstocks \n 2. Entfernen Sie die innere Abdeckung des Bienenstocks vom oberen Bienenstock \n 3. Wenn kein Königsinnenschutz verwendet wurde, prüfen Sie die Rähmchen auf Brut und entfernen Sie nur die Rähmchen, die ohne Brut sind. \n 4a. Bringen Sie oben im Bienenstock einen Abzug an, um die Bienen in den unteren Teil des Bienenstocks zu zwingen. \n 4b. Wiederholen Sie die Schritte 3 und 4a, bis alle Zargen entfernt sind. \n 5. Die Rähmchen in den Deckeln zum Honigraum transportieren \n 6. Die Rähmchen im Honigraum 1 bis 2 Tage lang erwärmen und entfeuchten \n 7. Mit dem Refraktometer prüfen, ob der Feuchtigkeitsgehalt unter 18,5 % liegt \n 8. Den Wachsdeckel des verdeckten Honigs manuell entfernen (Entdeckeln) \n 9. Honigschleuder beladen \n 10. Motor der Honigschleuder einschalten \n 11. Schleudervorgang mehrere Minuten lang laufen lassen \n 12. Entnehmen Sie die geschleuderten Rähmchen aus der Schleuder \n 13. Den Sumpf der Schleuder entleeren: Den gesammelten Honig durch die Schwerkraft in den Vorratsbehälter fliessen lassen. \n 14. Honig filtern \n 15. Honig sortieren \n 16. Honig abfüllen', DATE_ADD(CURDATE(), INTERVAL 1 MONTH), NULL, NULL, 3, NULL, 22, 7),
    ('Extraktion', NULL, 'harvest', 'planned', '1. Entfernen Sie die äussere Abdeckung des Bienenstocks von der Oberseite des Bienenstocks \n 2. Entfernen Sie die innere Abdeckung des Bienenstocks vom oberen Bienenstock \n 3. Wenn kein Königsinnenschutz verwendet wurde, prüfen Sie die Rähmchen auf Brut und entfernen Sie nur die Rähmchen, die ohne Brut sind. \n 4a. Bringen Sie oben im Bienenstock einen Abzug an, um die Bienen in den unteren Teil des Bienenstocks zu zwingen. \n 4b. Wiederholen Sie die Schritte 3 und 4a, bis alle Zargen entfernt sind. \n 5. Die Rähmchen in den Deckeln zum Honigraum transportieren \n 6. Die Rähmchen im Honigraum 1 bis 2 Tage lang erwärmen und entfeuchten \n 7. Mit dem Refraktometer prüfen, ob der Feuchtigkeitsgehalt unter 18,5 % liegt \n 8. Den Wachsdeckel des verdeckten Honigs manuell entfernen (Entdeckeln) \n 9. Honigschleuder beladen \n 10. Motor der Honigschleuder einschalten \n 11. Schleudervorgang mehrere Minuten lang laufen lassen \n 12. Entnehmen Sie die geschleuderten Rähmchen aus der Schleuder \n 13. Den Sumpf der Schleuder entleeren: Den gesammelten Honig durch die Schwerkraft in den Vorratsbehälter fliessen lassen. \n 14. Honig filtern \n 15. Honig sortieren \n 16. Honig abfüllen', DATE_ADD(CURDATE(), INTERVAL 1 MONTH), NULL, NULL, 3, NULL, 23, 7);


-- user 11 / all apiaries
INSERT INTO `beez`.`operations` (`name`, `description`, `type`, `status`, `planning_comments`, `planned_date`, `execution_comments`, `executed_date`,  `user_id`, `plan_id`, `beehive_id`, `apiary_id`)
VALUES
    ('Count the bees', 'Are there any bees inside?', 'analysis', 'planned', NULL, DATE_ADD(CURDATE(), INTERVAL 1 DAY), NULL, NULL, 11, 11, NULL, 11),

    ('Paint the beehive', NULL, 'interventions', 'planned', 'User the rainbow pallet :)', DATE_ADD(CURDATE(), INTERVAL 5 DAY), NULL, NULL, 11, 12, 41, 12),
    ('Paint the beehive', NULL, 'interventions', 'planned', 'User the rainbow pallet :)', DATE_ADD(CURDATE(), INTERVAL 5 DAY), NULL, NULL, 11, 12, 42, 12),
    ('Paint the beehive', NULL, 'interventions', 'planned', 'User the rainbow pallet :)', DATE_ADD(CURDATE(), INTERVAL 5 DAY), NULL, NULL, 11, 12, 43, 12),
    ('Paint the beehive', NULL, 'interventions', 'planned', 'User the rainbow pallet :)', DATE_ADD(CURDATE(), INTERVAL 5 DAY), NULL, NULL, 11, 12, 44, 12),
    ('Paint the beehive', NULL, 'interventions', 'planned', 'User the rainbow pallet :)', DATE_ADD(CURDATE(), INTERVAL 5 DAY), NULL, NULL, 11, 12, 45, 12),

    ('Cut the grass', NULL, 'custom', 'planned', 'Don''t leave a single blade of grass !', DATE_ADD(CURDATE(), INTERVAL 7 DAY), NULL, NULL, 11, 13, NULL, 13),
    ('Cut the grass', NULL, 'custom', 'planned', 'Don''t leave a single blade of grass !', DATE_ADD(CURDATE(), INTERVAL 8 DAY), NULL, NULL, 11, 13, NULL, 13),
    ('Cut the grass', NULL, 'custom', 'planned', 'Don''t leave a single blade of grass !', DATE_ADD(CURDATE(), INTERVAL 9 DAY), NULL, NULL, 11, 13, NULL, 13),
    ('Cut the grass', NULL, 'custom', 'planned', 'Don''t leave a single blade of grass !', DATE_ADD(CURDATE(), INTERVAL 10 DAY), NULL, NULL, 11, 13, NULL, 13),

    ('Collect the honey', NULL, 'harvest', 'planned', NULL, DATE_ADD(CURDATE(), INTERVAL 11 DAY), NULL, NULL, 11, NULL, 31, NULL),
    ('Collect the honey', NULL, 'harvest', 'planned', NULL, DATE_ADD(CURDATE(), INTERVAL 12 DAY), NULL, NULL, 11, NULL, 32, NULL),
    ('Collect the honey', NULL, 'harvest', 'planned', NULL, DATE_ADD(CURDATE(), INTERVAL 13 DAY), NULL, NULL, 11, NULL, 33, NULL),
    ('Collect the honey', NULL, 'harvest', 'planned', NULL, DATE_ADD(CURDATE(), INTERVAL 14 DAY), NULL, NULL, 11, NULL, 34, NULL),
    ('Collect the honey', NULL, 'harvest', 'planned', NULL, DATE_ADD(CURDATE(), INTERVAL 15 DAY), NULL, NULL, 11, NULL, 35, NULL),
    ('Collect the honey', NULL, 'harvest', 'planned', NULL, DATE_ADD(CURDATE(), INTERVAL 16 DAY), NULL, NULL, 11, NULL, 36, NULL),
    ('Collect the honey', NULL, 'harvest', 'planned', NULL, DATE_ADD(CURDATE(), INTERVAL 17 DAY), NULL, NULL, 11, NULL, 37, NULL);

-- Soft deleted Maintenance operation --
INSERT INTO `beez`.`operations` (`name`, `description`, `type`, `status`, `planning_comments`, `planned_date`, `execution_comments`,`user_id`,`deleted_at`)
VALUES
    ('Deleted operation','Soft deleted operation template','analysis', 'planned', NULL, CURDATE(), NULL, 1,NOW(3));

-- Settings --
INSERT INTO `beez`.`settings` (`key`, `value`, `scope`)
VALUES
    ('ui.table.default_page_size', 15, NULL),
    ('ui.sidebar.show_dashboard', false, NULL),
    ('ui.sidebar.show_themes', true, NULL),
    ('ui.sidebar.show_components', false, NULL),
    ('ui.table.default_page_size', 50, 2),
    ('ui.user_communities', true, NULL),
    ('notification.email.bcc_to_system',true,NULL),
    ('ui.graphs.number_of_days','7d',NULL),
    ('ui.graphs.number_of_days','9d',1);


-- deinit --
SET time_zone='SYSTEM';