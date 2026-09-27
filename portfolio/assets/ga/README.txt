GRAPHICAL ABSTRACTS — where to put your images
==============================================

Each publication on the site has a slot for its graphical abstract.
Drop the image file into THIS folder using the exact filename below,
then refresh the browser. Nothing else needs editing.

Save each file as PNG (or JPG renamed to .png — the browser handles either,
but PNG is safest for the line art most graphical abstracts use).
Recommended size: 1200 x 800 px (3:2). Anything close to that works.

DON'T WANT TO RENAME BY HAND?
------------------------------
Run this from the portfolio folder instead:

    powershell -ExecutionPolicy Bypass -File tools\add-ga.ps1 -DryRun

It looks through your Downloads folder, works out which image belongs to
which paper from the article code in the filename (ol6c02280 -> Org. Lett.
2026, d4cc04914d -> Chem. Commun. 2025, and so on), copies each one in
under the expected name, and prints a report. Drop -DryRun to actually
copy. Anything it cannot identify with confidence is left alone and listed,
so a paper never ends up with someone else's figure. Use -Force to replace
images already installed, -MaxWidth 1200 to also downscale anything huge.

Note: ACS serves the same figure at several sizes and the small ones are
only ~500px wide. The script refuses anything under 800px wide for that
reason — grab the larger version from the article page.

FILES NEEDED
------------
orglett-2026.png                 Org. Lett. 2026, 28(30), 9621-9627
chemcomm-2025-para-substitution.png
                                  Chem. Commun. 2025, 61, 3888-3891
chemcomm-2025-pyridinium.png     Chem. Commun. 2025, 61, 3436-3446
synthesis-2025-giese.png         Synthesis 2025, 57, 481-487
joc-2024-perfluoroalkylation.png J. Org. Chem. 2024, 89, 14785-14801
obc-2024-perfluoroalkylation.png Org. Biomol. Chem. 2024, 22, 4072-4076
synthesis-2023-selenation.png    Synthesis 2023, 55, 3685-3692
obc-2022-iminochromene.png       Org. Biomol. Chem. 2022, 20, 7891-7895
chemcomm-2022-benzo-core.png     Chem. Commun. 2022, 58, 9674-9677
obc-2022-redox-amines.png        Org. Biomol. Chem. 2022, 20, 5716-5720
synthesis-2020-spiro-lactams.png Synthesis 2020, 52(17), 2551-2562

WHERE TO GET THEM
-----------------
The graphical abstract sits on the publisher's article page, usually as the
first or last figure. Use the DOI links already on the site, or go direct:

  ACS      (Org. Lett., J. Org. Chem.)
           https://pubs.acs.org/doi/10.1021/acs.orglett.6c02280
           Look for the "Graphical Abstract" figure, right-click > Save image as.

  RSC      (Chem. Commun., Org. Biomol. Chem.)
           https://pubs.rsc.org/en/content/articlelanding/2025/cc/d4cc04914d
           The image is near the top of the abstract page.

  Thieme   (Synthesis)
           https://www.thieme-connect.com/products/ejournals/abstract/10.1055/a-2413-7058
           Under the abstract; may need an institutional login.

Tip: right-click the image in the browser and choose "Save image as...",
then rename the file to the name listed above.

IF AN IMAGE IS MISSING
----------------------
Nothing breaks. The slot shows a hatched placeholder reading
"Graphical abstract" plus the journal and year, and it still links
through to the paper. So add them one at a time — the site looks
finished either way.
